import { serverEncounterError } from "@/constants/error";
import { ResponseError } from "@/exceptions/responseError";
import { refreshTokens } from "@/services/auth";
import { APIResponse } from "@/types/responses";
import apiService from "@/utils/apiService";
import { SessionData } from "@/utils/session";
import { SessionOptions, getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<APIResponse<null> | SessionData>
) {
    try {
		const options: SessionOptions = {
			password: process.env.SESSION_SECRET ?? "",
			cookieName: process.env.COOKIE_NAME ?? "",
			cookieOptions: {
				secure: false,
			},
		};

		const session = await getIronSession<SessionData>(
			request,
			response,
			options
		);

        if (request.method === "POST") {
            const refreshRes = await refreshTokens();

            session.access_token = refreshRes?.data?.access_token ?? "";
            session.refresh_token = refreshRes?.data?.refresh_token ?? "";

            await session.save();
			response.status(200).json({
				access_token: session.access_token,
				refresh_token: session.refresh_token,
				profile_set: session.profile_set,
				role: session.role,
			});
        }
	} catch (e: any) {
		if (e instanceof ResponseError) {
			const error = await e.response.json();
			return response.status(e.response.status).json({
				message: error.message,
			});
		}
		return response.status(500).json({
			message: serverEncounterError,
		});
	}
}