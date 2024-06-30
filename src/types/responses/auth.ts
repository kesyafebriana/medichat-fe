import { APIResponse } from ".";

export interface AuthToken {
	access_token: string;
	refresh_token: string;
	access_expires_at: string;
	refresh_expires_at: string;
}

interface GoogleAuthCallbackData {
	access_token: string;
	refresh_token: string;
	access_expires_at: string;
	refresh_expires_at: string;
}

export interface LoginResponse extends APIResponse<AuthToken> {}

export interface GoogleAuthResponse extends APIResponse<string> {}

export interface GoogleAuthCallbackResponse
	extends APIResponse<GoogleAuthCallbackData> {}

export interface RegisterResponse extends APIResponse<null> {}
