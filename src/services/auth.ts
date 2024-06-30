import { ResponseError } from "@/exceptions/responseError";
import {
	CheckResetPasswordTokenQuery,
	CheckVerifyTokenQuery,
	ForgetPasswordRequest,
	GetVerifyTokenRequest,
	GoogleAuthCallbackQuery,
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	VerifyAccountRequest,
} from "@/types/requests/auth";
import { APIResponse } from "@/types/responses";
import {
	GoogleAuthCallbackResponse,
	GoogleAuthResponse,
	LoginResponse,
	RegisterResponse,
} from "@/types/responses/auth";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const login = async (
	payload: LoginRequest
): Promise<LoginResponse | undefined> => {
	try {
		const res = await apiService.post<LoginResponse>("auth/login", {
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const refreshTokens = async (
): Promise<LoginResponse | undefined> => {
	try {
		const res = await apiService.post<LoginResponse>(
			`auth/refresh`,
			{
				credentials: "include",
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const googleAuth = async (): Promise<GoogleAuthResponse | undefined> => {
	try {
		const res = await apiService.get<GoogleAuthResponse>("google/auth", {
			credentials: "include",
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const googleAuthCallback = async (
	query: GoogleAuthCallbackQuery
): Promise<GoogleAuthCallbackResponse | undefined> => {
	try {
		const urlParams = new URLSearchParams(
			`state=${query.state}&code=${query.code}`
		);
		const res = await apiService.get<GoogleAuthCallbackResponse>(
			`google/callback?${urlParams.toString()}`,
			{
				credentials: "include",
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const register = async (
	payload: RegisterRequest
): Promise<RegisterResponse | undefined> => {
	try {
		const res = await apiService.post<RegisterResponse>("auth/register", {
			body: JSON.stringify(payload),
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getVerifyToken = async (
	payload: GetVerifyTokenRequest
): Promise<APIResponse<string> | undefined> => {
	try {
		const res = await apiService.post<APIResponse<string>>(
			"auth/verify-token",
			{
				body: JSON.stringify(payload),
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const verifyAccount = async (
	payload: VerifyAccountRequest
): Promise<APIResponse<null> | undefined> => {
	try {
		const res = await apiService.post<APIResponse<null>>("auth/verify-email", {
			body: JSON.stringify(payload),
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const checkVerifyToken = async (
	query: CheckVerifyTokenQuery
): Promise<APIResponse<null> | undefined> => {
	try {
		const urlParams = new URLSearchParams(
			`email=${query.email}&verify_email_token=${query.verify_email_token}`
		);
		const res = await apiService.get<APIResponse<null>>(
			`auth/check-verify-token?${urlParams.toString()}`
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const checkResetPasswordToken = async (
	query: CheckResetPasswordTokenQuery
): Promise<APIResponse<null> | undefined> => {
	try {
		const urlParams = new URLSearchParams(
			`email=${query.email}&reset_password_token=${query.reset_password_token}`
		);
		const res = await apiService.get<APIResponse<null>>(
			`auth/check-reset-token?${urlParams.toString()}`
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const forgetPassword = async (
	payload: ForgetPasswordRequest
): Promise<APIResponse<string> | undefined> => {
	try {
		const res = await apiService.post<APIResponse<string>>(
			"auth/forget-password",
			{
				body: JSON.stringify(payload),
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const resetPassword = async (
	payload: ResetPasswordRequest
): Promise<APIResponse<string> | undefined> => {
	try {
		const res = apiService.post<APIResponse<string>>("auth/reset-password", {
			body: JSON.stringify(payload),
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};
