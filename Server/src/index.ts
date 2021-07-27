import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import path from "path";
import { List } from "./entity/List";
import { Task } from "./entity/Task";
import { createUserLoader } from "./utils/createUserLoader";
import { createListLoader } from "./utils/createListLoader";
import { TaskResolver } from "./resolvers/TaskResolver";
import { ListResolver } from "./resolvers/ListResolver";

const main = async () => {
	const conn = await createConnection({
		type: "postgres",
		url: process.env.DATABASE_URL,
		logging: true,
		//synchronize: true,
		migrations: [path.join(__dirname, "./migrations/*")],
		entities: [User, List, Task],
	});
	await conn.runMigrations();

	const app = express();

	let RedisStore = connectRedis(session);
	let redis;
	__prod__
		? (redis = new Redis(process.env.REDIS_URL))
		: (redis = new Redis());
	app.set("trust proxy", 1);
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		})
	);

	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax", // csrf
				secure: __prod__, // cookie only works in https
				domain: __prod__ ? ".eybye-todo.xyz" : undefined,
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, TaskResolver, ListResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			userLoader: createUserLoader(),
			listLoader: createListLoader(),
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
};

main().catch((err) => {
	console.error(err);
});
