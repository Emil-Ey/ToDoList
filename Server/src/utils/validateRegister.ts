import UsernamePasswordInput from "./usernamePasswordInput";

function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export const validateRegister = (options: UsernamePasswordInput) => {
	// Check if username includes @
	if (options.username.includes("@")) {
		return [
			{
				field: "username",
				message: "Username must not contain a '@'",
			},
		];
	}
	// Check if email i valid
	if (!validateEmail(options.email)) {
		return [
			{
				field: "email",
				message: "Invalid email",
			},
		];
	}
	// Check if username is at least of length 2
	if (options.username.length <= 2) {
		return [
			{
				field: "username",
				message: "Username must be at least 2 characters",
			},
		];
	}
	// Check if password is at least of length 3
	if (options.password.length <= 3) {
		return [
			{
				field: "password",
				message: "Password must be at least 4 characters",
			},
		];
	}

	return null;
};
