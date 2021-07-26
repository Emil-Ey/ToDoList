import { FieldError2 } from "../generated/graphql";

export const toErrorMap2 = (errors: FieldError2[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		errorMap[field] = message;
	});

	return errorMap;
};
