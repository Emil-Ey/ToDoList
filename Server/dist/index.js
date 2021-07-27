"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("./resolvers/UserResolver");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const path_1 = __importDefault(require("path"));
const List_1 = require("./entity/List");
const Task_1 = require("./entity/Task");
const createUserLoader_1 = require("./utils/createUserLoader");
const createListLoader_1 = require("./utils/createListLoader");
const TaskResolver_1 = require("./resolvers/TaskResolver");
const ListResolver_1 = require("./resolvers/ListResolver");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [User_1.User, List_1.List, Task_1.Task],
    });
    yield conn.runMigrations();
    const app = express_1.default();
    let RedisStore = connect_redis_1.default(express_session_1.default);
    let redis;
    constants_1.__prod__
        ? (redis = new ioredis_1.default(process.env.REDIS_URL))
        : (redis = new ioredis_1.default());
    app.set("trust proxy", 1);
    app.use(cors_1.default({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
            domain: constants_1.__prod__ ? ".eybye-todo.xyz" : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [UserResolver_1.UserResolver, TaskResolver_1.TaskResolver, ListResolver_1.ListResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader_1.createUserLoader(),
            listLoader: createListLoader_1.createListLoader(),
        }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    const port = process.env.PORT;
    app.listen(parseInt(port), () => {
        console.log(`server started on localhost:${port}`);
    });
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map