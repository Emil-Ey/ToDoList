import { List } from "../entity/List";
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
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

@ObjectType()
class FieldError2 {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class ListResponse {
	@Field(() => [FieldError2], { nullable: true })
	errors?: [];

	@Field(() => List, { nullable: true })
	list?: List;
}

@Resolver(List)
export class ListResolver {
	// FieldResolvers
	@FieldResolver(() => User)
	creator(@Root() list: List, @Ctx() { userLoader }: MyContext) {
		return userLoader.load(list.creatorId);
	}

	// Queries
	@Query(() => List, { nullable: true })
	@UseMiddleware(isAuth)
	list(@Arg("id", () => Int) id: number): Promise<List | undefined> {
		return List.findOne(id);
	}

	@Query(() => Int)
	@UseMiddleware(isAuth)
	async tasksNotDone(@Arg("listId", () => Int) listId: number) {
		// TODO
		const [{ count }] = await getConnection().query(
			`
					SELECT count(*)
					FROM task t
					WHERE t."listId" = $1 AND t.done = false
				`,
			[listId]
		);
		return count;
	}

	@Query(() => [List])
	@UseMiddleware(isAuth)
	async lists(
		@Arg("userId", () => Int) userId: number,
		@Ctx() { req }: MyContext
	): Promise<List[]> {
		if (req.session.userId !== userId) {
			throw new Error("Wrong user");
		}
		const replacements: any[] = [userId];
		const lists = await getConnection().query(
			`
					SELECT l.*
					FROM list l
					WHERE l."creatorId" = $1
					ORDER BY l."createdAt" DESC
				`,
			replacements
		);

		return lists;
	}

	// Mutations
	@Mutation(() => List)
	@UseMiddleware(isAuth)
	async createList(
		@Arg("title") title: string,
		@Arg("desc") desc: string,
		@Ctx() { req }: MyContext
	) {
		// if (!title) {
		// 	return {
		// 		errors: [
		// 			{
		// 				field: "title",
		// 				message: "The list must have a title",
		// 			},
		// 		],
		// 	};
		// }

		return {
			list: List.create({
				title,
				desc,
				creatorId: req.session.userId,
			}).save(),
		};
	}

	@Mutation(() => List, { nullable: true })
	@UseMiddleware(isAuth)
	async updateList(
		@Arg("id", () => Int) id: number,
		@Arg("title") title: string,
		@Arg("desc") desc: string,
		@Ctx() { req }: MyContext
	): Promise<List | null> {
		const result = await getConnection()
			.createQueryBuilder()
			.update(List)
			.set({ title, desc })
			.where('id = :id AND "creatorId" = :creatorId', {
				id,
				creatorId: req.session.userId,
			})
			.returning("*")
			.execute();

		return result.raw[0];
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteList(
		@Arg("id", () => Int) id: number,
		@Ctx() { req }: MyContext
	): Promise<Boolean> {
		const list = await List.findOne(id);
		if (!list) {
			return false;
		}
		if (list.creatorId !== req.session.userId) {
			throw new Error(
				"You cannot delete a post created by another user."
			);
		}
		await Task.delete({ listId: id });
		await List.delete({ id, creatorId: req.session.userId });
		return true;
	}
}
