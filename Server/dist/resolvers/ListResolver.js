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
exports.ListResolver = void 0;
const List_1 = require("../entity/List");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const isAuth_1 = require("../middleware/isAuth");
const Task_1 = require("../entity/Task");
const User_1 = require("../entity/User");
let FieldError2 = class FieldError2 {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError2.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError2.prototype, "message", void 0);
FieldError2 = __decorate([
    type_graphql_1.ObjectType()
], FieldError2);
let ListResponse = class ListResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError2], { nullable: true }),
    __metadata("design:type", Array)
], ListResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => List_1.List, { nullable: true }),
    __metadata("design:type", List_1.List)
], ListResponse.prototype, "list", void 0);
ListResponse = __decorate([
    type_graphql_1.ObjectType()
], ListResponse);
let ListResolver = class ListResolver {
    creator(list, { userLoader }) {
        return userLoader.load(list.creatorId);
    }
    list(id) {
        return List_1.List.findOne(id);
    }
    tasksNotDone(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ count }] = yield typeorm_1.getConnection().query(`
					SELECT count(*)
					FROM task t
					WHERE t."listId" = $1 AND t.done = false
				`, [listId]);
            return count;
        });
    }
    lists(userId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId !== userId) {
                throw new Error("Wrong user");
            }
            const replacements = [userId];
            const lists = yield typeorm_1.getConnection().query(`
					SELECT l.*
					FROM list l
					WHERE l."creatorId" = $1
					ORDER BY l."createdAt" DESC
				`, replacements);
            return lists;
        });
    }
    createList(title, desc, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!title) {
                return {
                    errors: [
                        {
                            field: "title",
                            message: "The list must have a title",
                        },
                    ],
                };
            }
            return {
                list: List_1.List.create({
                    title,
                    desc,
                    creatorId: req.session.userId,
                }).save(),
            };
        });
    }
    updateList(id, title, desc, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .update(List_1.List)
                .set({ title, desc })
                .where('id = :id AND "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
                .returning("*")
                .execute();
            return result.raw[0];
        });
    }
    deleteList(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield List_1.List.findOne(id);
            if (!list) {
                return false;
            }
            if (list.creatorId !== req.session.userId) {
                throw new Error("You cannot delete a post created by another user.");
            }
            yield Task_1.Task.delete({ listId: id });
            yield List_1.List.delete({ id, creatorId: req.session.userId });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [List_1.List, Object]),
    __metadata("design:returntype", void 0)
], ListResolver.prototype, "creator", null);
__decorate([
    type_graphql_1.Query(() => List_1.List, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "list", null);
__decorate([
    type_graphql_1.Query(() => type_graphql_1.Int),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("listId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "tasksNotDone", null);
__decorate([
    type_graphql_1.Query(() => [List_1.List]),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("userId", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "lists", null);
__decorate([
    type_graphql_1.Mutation(() => ListResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("title")),
    __param(1, type_graphql_1.Arg("desc")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "createList", null);
__decorate([
    type_graphql_1.Mutation(() => List_1.List, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Arg("desc")),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "updateList", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListResolver.prototype, "deleteList", null);
ListResolver = __decorate([
    type_graphql_1.Resolver(List_1.List)
], ListResolver);
exports.ListResolver = ListResolver;
//# sourceMappingURL=ListResolver.js.map