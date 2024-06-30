import { LoginRequest } from "@/types/requests/auth";
import { APIResponse } from "@/types/responses";
import { selfApiService } from "@/utils/apiService";
import { wrapError } from "@/utils/exception";
import { SessionData } from "@/utils/session";

export const loginSession = async (
	payload: LoginRequest
): Promise<SessionData | undefined> => {
	try {
		return await selfApiService.post<SessionData>("sessions", {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const logoutSession = async () => {
	try {
		await selfApiService.delete("sessions", {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateSession = async (payload: SessionData) => {
	try {
		await selfApiService.put<APIResponse<string>>("sessions", {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const refreshSession = async (
): Promise<SessionData | undefined> => {
	try {
		return await selfApiService.post<SessionData>("session-refresh", {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};