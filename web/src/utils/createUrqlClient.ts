import { isServer } from "./isServer";
import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {
	LoginMutation,
	MeQuery,
	MeDocument,
	DeleteListMutationVariables,
	RegisterMutation,
	LogoutMutation,
	ChangeSettingsMutation,
} from "../generated/graphql";

const invalidateAllLists = (cache: Cache) => {
	const allFields = cache.inspectFields("Query");
	const fieldInfos = allFields.filter((info) => info.fieldName === "lists");
	fieldInfos.forEach((fi) => {
		cache.invalidate("Query", "lists", fi.arguments || {});
	});
};

const invalidateAllTasks = (cache: Cache) => {
	const allFields = cache.inspectFields("Query");
	const fieldInfos = allFields.filter((info) => info.fieldName === "tasks");
	fieldInfos.forEach((fi) => {
		cache.invalidate("Query", "tasks", fi.arguments || {});
	});
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = "";
	if (isServer()) {
		cookie = ctx?.req?.headers?.cookie;
	}

	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: cookie
				? {
						cookie,
				  }
				: undefined,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					PaginatedPosts: () => null,
				},
				updates: {
					Mutation: {
						register: (_result, args, cache, info) => {
							betterUpdateQuery<RegisterMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.register.errors) {
										return query;
									} else {
										return {
											me: result.register.user,
										};
									}
								}
							);
							invalidateAllLists(cache);
						},

						logout: (_result, args, cache, info) => {
							betterUpdateQuery<LogoutMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								() => ({ me: null })
							);
						},

						login: (_result, args, cache, info) => {
							betterUpdateQuery<LoginMutation, MeQuery>(
								cache,
								{ query: MeDocument },
								_result,
								(result, query) => {
									if (result.login.errors) {
										return query;
									} else {
										return {
											me: result.login.user,
										};
									}
								}
							);
							invalidateAllLists(cache);
						},

						deleteList: (_result, args, cache, info) => {
							cache.invalidate({
								__typename: "List",
								id: (args as DeleteListMutationVariables).id,
							});
						},

						createList: (_result, args, cache, info) => {
							invalidateAllLists(cache);
						},

						vote: (_result, args, cache, info) => {
							invalidateAllTasks(cache);
						},

						deleteTask: (_result, args, cache, info) => {
							invalidateAllTasks(cache);
						},

						createTask: (_result, args, cache, info) => {
							invalidateAllTasks(cache);
						},
					},
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	};
};
