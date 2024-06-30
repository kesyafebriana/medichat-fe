export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	role: string;
	email: string;
}

export interface GetVerifyTokenRequest extends Omit<LoginRequest, "password"> {}
export interface ForgetPasswordRequest extends Omit<LoginRequest, "password"> {}

export interface VerifyAccountRequest extends LoginRequest {
	verify_email_token: string;
}

export interface CheckVerifyTokenQuery {
	email: string;
	verify_email_token: string;
}

export interface CheckResetPasswordTokenQuery {
	email: string;
	reset_password_token: string;
}

export interface ResetPasswordRequest extends Omit<LoginRequest, "password"> {
	new_password: string;
	reset_password_token: string;
}

export interface GoogleAuthCallbackQuery {
	code: string;
	state: string;
}
