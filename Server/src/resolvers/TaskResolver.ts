import { List } from "../entity/List";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
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
import { Task } from "../entity/Task";

@ObjectType()
class FieldError1 {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class TaskResponse {
	@Field(() => [FieldError1], { nullable: true })
	errors?: [];

	@Field(() => Task, { nullable: true })
	task?: Task;
}

@Resolver(Task)
export class TaskResolver {
	// FieldResolvers
	@FieldResolver(() => List)
	list(@Root() task: Task, @Ctx() { listLoader }: MyContext) {
		return listLoader.load(task.listId);
	}

	// Queries
	@Query(() => [Task])
	@UseMiddleware(isAuth)
	async tasks(
		@Arg("listId", () => Int) listId: number,
		@Ctx() { req }: MyContext
	): Promise<Task[]> {
		const list = await List.findOne({ where: { id: listId } });
		const tasks = await getConnection().query(
			`
					SELECT t.*
					FROM task t
					WHERE t."listId" = $1
					ORDER BY t."createdAt" ASC
				`,
			[listId]
		);

		if (tasks.length < 1) {
			return tasks;
		}
		if (list?.creatorId !== req.session.userId) {
			throw new Error("You are not the owner of these tasks.");
		}
		return tasks;
	}

	// Mutations
	@Mutation(() => TaskResponse)
	@UseMiddleware(isAuth)
	async createTask(
		@Arg("text") text: string,
		@Arg("listId", () => Int) listId: number,
		@Ctx() { req }: MyContext
	) {
		if (!text) {
			return {
				errors: [
					{
						field: "text",
						message: "The task must contain some text",
					},
				],
			};
		}

		const list = await List.findOne({
			where: { id: listId, creatorId: req.session.userId },
		});
		if (!list) {
			return {
				errors: [
					{
						field: "text",
						message: "Something went wrong, try again later",
					},
				],
			};
		}
		const newTasksNo = list?.tasksNo + 1;
		await getConnection().transaction(async (tm) => {
			await tm.query(
				`
				UPDATE list
				set "tasksNo" = $1
				where "id" = $2
				`,
				[newTasksNo, listId]
			);
		});

		const result = await getConnection()
			.createQueryBuilder()
			.insert()
			.into(Task)
			.values([
				{
					text,
					listId,
				},
			])
			.returning("*")
			.execute();
		const task = result.raw[0];

		return { task };
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteTask(
		@Arg("id", () => Int) id: number,
		@Arg("listId", () => Int) listId: number,
		@Ctx() { req }: MyContext
	): Promise<Boolean> {
		console.log("1");
		const task = await Task.findOne({ where: { id, listId } });
		console.log("2");
		const list = await List.findOne(listId);
		console.log("3");
		if (!task) {
			return false;
		}
		if (!list) {
			return false;
		}
		if (list?.creatorId !== req.session.userId) {
			throw new Error(
				"You cannot delete a post created by another user."
			);
		}
		await Task.delete({ id, listId });
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async vote(
		@Arg("id", () => Int) id: number,
		@Arg("listId", () => Int) listId: number,
		@Ctx() { req }: MyContext
	) {
		const { userId } = req.session;
		const task = await Task.findOne({ where: { id, listId } });
		const prevStatus = task?.done;

		await getConnection().transaction(async (tm) => {
			await tm.query(
				`
				UPDATE task
				set done = $1
				where "id" = $2 AND "listId" = $3
				`,
				[!prevStatus, id, listId]
			);
		});

		return true;
	}
}
