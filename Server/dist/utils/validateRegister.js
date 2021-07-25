"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const validateRegister = (options) => {
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Username must not contain a '@'",
            },
        ];
    }
    if (!validateEmail(options.email)) {
        return [
            {
                field: "email",
                message: "Invalid email",
            },
        ];
    }
    if (options.username.length <= 2) {
        return [
            {
                field: "username",
                message: "Username must be at least 2 characters",
            },
        ];
    }
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
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map