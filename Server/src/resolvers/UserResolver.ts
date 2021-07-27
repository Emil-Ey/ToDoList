import { COOKIE_NAME, FORGET_PASSWORD_PREFIX, __prod__ } from "../constants";
import UsernamePasswordInput from "../utils/usernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import {
	Arg,
	Ctx,
	Field,
	FieldResolver,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { User } from "../entity/User";
import { MyContext } from "../types";
import argon2 from "argon2";
import { sendEmail } from "../utils/sendEmail";

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: [];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver(User)
export class UserResolver {
	// Field Resolvers
	@FieldResolver(() => String)
	email(@Root() user: User, @Ctx() { req }: MyContext) {
		if (req.session.userId === user.id) {
			return user.email;
		}
		return "";
	}

	// Queries
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		// You are not logged in
		if (!req.session.userId) {
			return null;
		}

		return User.findOne(req.session.userId);
	}

	// Mutations
	@Mutation(() => UserResponse)
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	) {
		const errors = validateRegister(options);
		if (errors) {
			return { errors };
		}

		const hashedPassword = await argon2.hash(options.password);
		let user: any;
		// TODO ADD THE NEW FIELDS (WHAT IS THE DEFAULT)?
		try {
			const result = await getConnection()
				.createQueryBuilder()
				.insert()
				.into(User)
				.values([
					{
						username: options.username,
						email: options.email.toLowerCase(),
						password: hashedPassword,
					},
				])
				.returning("*")
				.execute();
			user = result.raw[0];
		} catch (err) {
			if (
				err.code === "23505" &&
				err.detail.includes(options.email.toLowerCase())
			) {
				//duplicate email error
				return {
					errors: [
						{
							field: "email",
							message: "email already taken",
						},
					],
				};
			}
			if (err.code === "23505" && err.detail.includes(options.username)) {
				//duplicate username error
				return {
					errors: [
						{
							field: "username",
							message: "username already taken",
						},
					],
				};
			}
		}
		req.session.userId = user.id;
		req.session.save();
		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("usernameOrEmail") usernameOrEmail: string,
		@Arg("password") password: string,
		@Ctx() { req }: MyContext
	) {
		let user;
		if (usernameOrEmail.includes("@")) {
			user = await User.findOne({ where: { email: usernameOrEmail } });
		} else {
			user = await User.findOne({ where: { username: usernameOrEmail } });
		}

		if (!user) {
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect username or password",
					},
				],
			};
		}
		const valid = await argon2.verify(user.password, password);
		if (!valid) {
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect username or password",
					},
				],
			};
		}

		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy(function (err) {
				if (err) {
					console.log(err);
					resolve(false);
					return;
				}
				res.clearCookie(COOKIE_NAME);
				resolve(true);
			})
		);
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg("email") email: string,
		@Ctx() { redis }: MyContext
	) {
		const lowerCaseEmail = email.toLowerCase();
		const user = await User.findOne({ where: { email: lowerCaseEmail } });
		if (!user) {
			// Email not in the DB
			return true;
		}

		const token = v4();
		console.log(token);
		redis.set(
			FORGET_PASSWORD_PREFIX + token,
			user.id,
			"ex",
			1000 * 60 * 60 * 24 * 2 // 2 days
		);

		__prod__
			? sendEmail(
					email,
					`Click this link to change your password: <a href="http://eybye-todo.xyz/change-password/${token}">Reset password</a>`
			  )
			: sendEmail(
					email,
					`Click this link to change your password: <a href="http://localhost:3000/change-password/${token}">Reset password</a>`
			  );

		return true;
	}

	@Mutation(() => UserResponse)
	async changePassword(
		@Arg("token") token: string,
		@Arg("newPassword") newPassword: string,
		@Arg("newPassword1") newPassword1: string,
		@Ctx() { redis, req }: MyContext
	) {
		// Check if passwords are the same
		if (newPassword != newPassword1) {
			return {
				errors: [
					{
						field: "newPassword1",
						message: "passwords are not identical",
					},
				],
			};
		}
		// Check if password is at least of length 3
		if (newPassword.length <= 3) {
			return {
				errors: [
					{
						field: "newPassword",
						message: "password must be at least 4 characters",
					},
				],
			};
		}

		const key = FORGET_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);
		if (!userId) {
			return {
				errors: [
					{
						field: "token",
						message: "Token expired",
					},
				],
			};
		}

		const userIdNum = parseInt(userId);
		const user = await User.findOne(userIdNum);

		if (!user) {
			return {
				errors: [
					{
						field: "token",
						message: "user no longer exists",
					},
				],
			};
		}

		await User.update(
			{ id: userIdNum },
			{ password: await argon2.hash(newPassword) }
		);
		await redis.del(key);

		// Login user after changed password
		req.session.userId = user.id;
		req.session.save();
		return { user };
	}
}
