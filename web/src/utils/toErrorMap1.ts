import { FieldError1 } from "../generated/graphql";

export const toErrorMap1 = (errors: FieldError1[]) => {
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
