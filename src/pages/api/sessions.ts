import { NextApiRequest, NextApiResponse } from "next";
import { SessionOptions, getIronSession } from "iron-session";
import { SessionData } from "@/utils/session";
import { ResponseError } from "@/exceptions/responseError";
import { APIResponse } from "@/types/responses";
import { serverEncounterError } from "@/constants/error";
import apiService from "@/utils/apiService";
import { LoginResponse } from "@/types/responses/auth";
import { AccountProfile } from "@/types/responses/profile";

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
      const loginRes = await apiService.post<LoginResponse>("auth/login", {
        body: JSON.stringify({
          email: request.body.email,
          password: request.body.password,
        }),
      });

      const accountProfileRes = await apiService.get<
        APIResponse<AccountProfile>
      >("auth/profile", {
        headers: {
          Authorization: `Bearer ${loginRes?.data?.access_token}`,
        },
      });

      session.access_token = loginRes?.data?.access_token ?? "";
      session.refresh_token = loginRes?.data?.refresh_token ?? "";
      session.profile_set = accountProfileRes?.data?.profile_set ?? false;
      session.role = accountProfileRes?.data?.role ?? "";

      await session.save();
      const cookie = response.getHeader('Set-Cookie') as string[]
      cookie.push(
        `_medichat_RfTok_=${loginRes?.data?.refresh_token ?? ""}; httpOnly=true; path=/`
      )      

      response.status(200)
      .setHeader(
        'Set-Cookie',
        cookie,
      )
      .json({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        profile_set: session.profile_set,
        role: session.role,
      });
    } else if (request.method === "GET") {
      if (!session.access_token) {
        return response.status(401).end();
      }
      return response.json({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        role: session.role,
        profile_set: session.profile_set,
      });
    } else if (request.method === "PUT") {
      session.access_token = request.body.access_token;
      session.refresh_token = request.body.refresh_token;
      session.profile_set = request.body.profile_set;
      session.role = request.body.role;
      await session.save();
      const cookie = response.getHeader('Set-Cookie') as string[]
      cookie.push(
        `_medichat_RfTok_=${request.body.refresh_token ?? ""}; httpOnly=true; path=/`
      )      

      return response.status(200).setHeader(
        'Set-Cookie',
        cookie,
      ).json({
        message: "ok",
      });
    } else if (request.method === "DELETE") {
      session.destroy();
      const cookie = response.getHeader('Set-Cookie') as string[]
      cookie.push(
        `_medichat_RfTok_=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      )      
      return response.status(200).setHeader(
        'Set-Cookie',
        cookie,
      ).json({
        message: "ok",
      });
    }

		return response.status(404).json({
			message: "route not found",
		});
	} catch (e: any) {
		console.log(e);
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
