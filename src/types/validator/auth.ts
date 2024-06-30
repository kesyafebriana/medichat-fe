import * as yup from "yup";

const specialCharacters = "!@#$%^&*()\\-_=+{};:,<.>]";

const passwordValidation = function (value: string | undefined) {
	if (!value) return false;

	let countLower = 0,
		countUpper = 0,
		countSpecial = 0,
		countNumber = 0;

	for (let i = 0; i < value.length; i++) {
		const unicode = value.charCodeAt(i);
		if (unicode >= 65 && unicode <= 90) {
			countUpper++;
		} else if (unicode >= 97 && unicode <= 122) {
			countLower++;
		} else if (unicode >= 48 && unicode <= 57) {
			countNumber++;
		} else if (specialCharacters.includes(value[i])) {
			countSpecial++;
		}
	}

	return (
		countLower > 0 && countUpper > 0 && countSpecial >= 0 && countNumber > 0
	);
};

export const loginSchema = yup.object({
	email: yup
		.string()
		.email("invalid email format")
		.required("please fill email field"),
	password: yup
		.string()
		.test(
			"password-validation",
			"password should contain at least one number, special characters, uppercase, and lowercase",
			passwordValidation
		)
		.min(8, "minimum 8 characters")
		.max(24, "maximum 24 characters")
		.required("please fill password field"),
});
export type LoginFields = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
	email: yup
		.string()
		.email("invalid email format")
		.required("please fill email field"),
});
export type RegisterFields = yup.InferType<typeof registerSchema>;

export const accountVerificationSchema = yup.object({
	password: yup
		.string()
		.test(
			"password-validation",
			"password should contain at least one number, special characters, uppercase, and lowercase",
			passwordValidation
		)
		.required("please fill password field")
		.min(8, "minimum 8 characters")
		.max(24, "maximum 24 characters"),
	confirmPassword: yup
		.string()
		.required("please fill password field")
		.min(8, "minimum 8 characters")
		.max(24, "maximum 24 characters")
		.oneOf([yup.ref("password")], "confirm passwords should match"),
});
export type AccountVerificationFields = yup.InferType<
	typeof accountVerificationSchema
>;

export const forgotPassworsSchema = registerSchema;
export type ForgotPasswordFields = yup.InferType<typeof forgotPassworsSchema>;

export const resetPasswordSchema = accountVerificationSchema;
export type ResetPasswordFields = yup.InferType<typeof resetPasswordSchema>;
