import { unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData } from "./utils/session";
import { pages } from "./constants/pages";
import { role } from "./constants/role";
import { logoutSession } from "./services/sessions";

const pharmacyManagerRoutes: string[] = [
	pages.pharmacyManager.ORDER,
	pages.pharmacyManager.MUTATION,
	pages.pharmacyManager.PHARMACY,
	pages.pharmacyManager.STOCKS,
	"/refresh",
];

const adminRoutes: string[] = [
	pages.admin.CATEGORIES,
	pages.admin.DASHBOARD,
	pages.admin.ORDERS,
	pages.admin.PARTNERS,
	pages.admin.PRODUCT,
	"/refresh",
];

const userRoutes: string[] = [
	pages.HOME,
	pages.SET_PROFILE,
	pages.PROFILE,
	pages.CART,
	pages.CHAT,
	pages.MEDISHOP,
	pages.DOCTORS,
	pages.ORDER,
	"/login-redirect",
	"/refresh",
];

const doctorRoutes: string[] = [
	pages.HOME,
	pages.SET_PROFILE,
	pages.PROFILE,
	pages.CHAT,
	"/refresh",
];

const unrestrictedRoutes: string[] = [
	pages.LOGIN,
	pages.REGISTER,
	pages.FORGOT_PASSWORD,
	pages.RESET_PASSWORD,
	pages.VERIFY,
	pages.HOME,
	pages.DOCTORS,
	pages.MEDISHOP,
];

const publicRoutes: string[] = [pages.HOME, pages.DOCTORS, pages.MEDISHOP];

const isHavingSlug = (route: string): boolean => {
	const t = route.split("/").slice(1);
	return t.length > 1 && t[1].length !== 0;
};

const defaultRoute = (r: string): string => {
	switch (r) {
		case role.ADMIN:
			return process.env.NEXT_PUBLIC_LOGIN_ADMIN_REDIRECT ?? "";
		case role.DOCTOR:
			return process.env.NEXT_PUBLIC_LOGIN_DOCTOR_REDIRECT ?? "";
		case role.PHARMACY_MANAGER:
			return process.env.NEXT_PUBLIC_LOGIN_PHARMACY_REDIRECT ?? "";
		case role.USER:
			return process.env.NEXT_PUBLIC_LOGIN_USER_REDIRECT ?? "";
		default:
			return process.env.NEXT_PUBLIC_LOGIN_DEFAULT_REDIRECT ?? "";
	}
};

export async function middleware(request: NextRequest) {
	try {
		const cookie = request.headers.get("cookie");

		const cSession = cookie
			?.split("; ")
			.find((s) => s.startsWith(`${process.env.COOKIE_NAME}=`))
			?.split("=")[1];

		if (!cSession) {
			if (
				unrestrictedRoutes.some((r) => request.nextUrl.pathname.includes(r))
			) {
				if (
					request.nextUrl.pathname.includes(pages.MEDISHOP) &&
					isHavingSlug(request.nextUrl.pathname)
				) {
					return NextResponse.redirect(process.env.BASE_PATH + pages.LOGIN);
				}
				return NextResponse.next();
			}
			return NextResponse.redirect(
				new URL(process.env.BASE_PATH + pages.LOGIN, request.url)
			);
		}

		const sessionData = await unsealData<SessionData>(cSession, {
			password: process.env.SESSION_SECRET as string,
		});

		if (!sessionData.access_token) {
			return NextResponse.redirect(
				new URL(process.env.BASE_PATH + pages.LOGIN, request.url)
			);
		}

		if (
			!sessionData.profile_set &&
			request.nextUrl.pathname !== pages.SET_PROFILE
		) {
			return NextResponse.redirect(
				new URL(process.env.BASE_PATH + pages.SET_PROFILE, request.url)
			);
		}

		if (unrestrictedRoutes.some((r) => request.nextUrl.pathname.includes(r))) {
			if (
				publicRoutes.some((r) => request.nextUrl.pathname.includes(r)) &&
				[role.USER, role.DOCTOR].includes(sessionData.role)
			) {
				return NextResponse.next();
			}
			return NextResponse.redirect(
				new URL(
					process.env.BASE_PATH + defaultRoute(sessionData.role),
					request.url
				)
			);
		}

		if (
			sessionData.role === role.PHARMACY_MANAGER &&
			!pharmacyManagerRoutes.some((r) => request.nextUrl.pathname.includes(r))
		) {
			return NextResponse.redirect(
				new URL(
					process.env.BASE_PATH + defaultRoute(sessionData.role),
					request.url
				)
			);
		}

		if (
			sessionData.role === role.ADMIN &&
			!adminRoutes.some((r) => request.nextUrl.pathname.includes(r))
		) {
			return NextResponse.redirect(
				new URL(
					process.env.BASE_PATH + defaultRoute(sessionData.role),
					request.url
				)
			);
		}

		if (
			sessionData.role === role.USER &&
			!userRoutes.some((r) => request.nextUrl.pathname.includes(r))
		) {
			return NextResponse.redirect(
				new URL(
					process.env.BASE_PATH + defaultRoute(sessionData.role),
					request.url
				)
			);
		}

		if (
			sessionData.role === role.DOCTOR &&
			!doctorRoutes.some((r) => request.nextUrl.pathname.includes(r))
		) {
			return NextResponse.redirect(
				new URL(
					process.env.BASE_PATH + defaultRoute(sessionData.role),
					request.url
				)
			);
		}

		if (
			request.nextUrl.pathname === pages.SET_PROFILE &&
			sessionData.profile_set
		) {
			return NextResponse.redirect(
				new URL(defaultRoute(sessionData.role), request.url)
			);
		}

		return NextResponse.next();
	} catch (e) {
		await logoutSession();
		return NextResponse.redirect(
			new URL(process.env.BASE_PATH + pages.LOGIN, request.url)
		);
	}
}

export const config = {
	matcher: [
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},

		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			has: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},

		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			has: [{ type: "header", key: "x-present" }],
			missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
		},
	],
};
