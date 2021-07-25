import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		if (
			field === "password" &&
			message === "Incorrect username or password"
		) {
			errorMap["usernameOrEmail"] = " ";
		}
		errorMap[field] = message;
	});

	return errorMap;
};
