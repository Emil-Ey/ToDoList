"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResolver = void 0;
const List_1 = require("../entity/List");
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Task_1 = require("../entity/Task");
let FieldError1 = class FieldError1 {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError1.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError1.prototype, "message", void 0);
FieldError1 = __decorate([
    type_graphql_1.ObjectType()
], FieldError1);
let TaskResponse = class TaskResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError1], { nullable: true }),
    __metadata("design:type", Array)
], TaskResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Task_1.Task, { nullable: true }),
    __metadata("design:type", Task_1.Task)
], TaskResponse.prototype, "task", void 0);
TaskResponse = __decorate([
    type_graphql_1.ObjectType()
], TaskResponse);
let TaskResolver = class TaskResolver {
    list(task, { listLoader }) {
        return listLoader.load(task.listId);
    }
    tasks(listId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield List_1.List.findOne({ where: { id: listId } });
            const tasks = yield typeorm_1.getConnection().query(`
					SELECT t.*
					FROM task t
					WHERE t."listId" = $1
					ORDER BY t."createdAt" ASC
				`, [listId]);
            if (tasks.length < 1) {
                return tasks;
            }
            if ((list === null || list === void 0 ? void 0 : list.creatorId) !== req.session.userId) {
                throw new Error("You are not the owner of these tasks.");
            }
            return tasks;
        });
    }
    createTask(text, listId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const list = yield List_1.List.findOne({
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
            const newTasksNo = (list === null || list === void 0 ? void 0 : list.tasksNo) + 1;
            yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                yield tm.query(`
				UPDATE list
				set "tasksNo" = $1
				where "id" = $2
				`, [newTasksNo, listId]);
            }));
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(Task_1.Task)
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
        });
    }
    deleteTask(id, listId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1");
            const task = yield Task_1.Task.findOne({ where: { id, listId } });
            console.log("2");
            const list = yield List_1.List.findOne(listId);
            console.log("3");
            if (!task) {
                return false;
            }
            if (!list) {
                return false;
            }
            if ((list === null || list === void 0 ? void 0 : list.creatorId) !== req.session.userId) {
                throw new Error("You cannot delete a post created by another user.");
            }
            yield Task_1.Task.delete({ id, listId });
            return true;
        });
    }
    vote(id, listId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.session;
            const task = yield Task_1.Task.findOne({ where: { id, listId } });
            const prevStatus = task === null || task === void 0 ? void 0 : task.done;
            yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                yield tm.query(`
				UPDATE task
				set done = $1
				where "id" = $2 AND "listId" = $3
				`, [!prevStatus, id, listId]);
            }));
            return true;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => List_1.List),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Task_1.Task, Object]),
    __metadata("design:returntype", void 0)
], TaskResolver.prototype, "list", null);
__decorate([
    type_graphql_1.Query(() => [Task_1.Task]),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("listId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "tasks", null);
__decorate([
    type_graphql_1.Mutation(() => TaskResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("text")),
    __param(1, type_graphql_1.Arg("listId", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "createTask", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("listId", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "deleteTask", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("listId", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "vote", null);
TaskResolver = __decorate([
    type_graphql_1.Resolver(Task_1.Task)
], TaskResolver);
exports.TaskResolver = TaskResolver;
//# sourceMappingURL=TaskResolver.js.map