import { pages } from "@/constants/pages";
import { useAppDispatch } from "@/redux/reduxHook";
import { googleAuthCallback } from "@/services/auth";
import { getAccountProfile } from "@/services/profile";
import { updateSession } from "@/services/sessions";
import { SessionData } from "@/utils/session";
import { Flex, Spinner } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React from "react";

let isFetched = false;

const Page = ({ code, state }: PageProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	React.useEffect(() => {
		const getGoogleAuthCallback = async () => {
			try {
				isFetched = true;
				const res = await googleAuthCallback({ code: code, state: state });
				if (res?.data) {
					const profileRes = await getAccountProfile(res.data.access_token);
					if (profileRes?.data) {
						if (profileRes.data.role === "user") {
							const payload: SessionData = {
								access_token: res.data.access_token,
								refresh_token: res.data.refresh_token,
								role: profileRes.data.role,
								profile_set: profileRes.data.profile_set,
							};
							await updateSession(payload);
							if (profileRes.data.profile_set) {
								router.replace(pages.HOME);
								return;
							}
							router.replace(pages.SET_PROFILE);
						}
					}
				}
			} catch (e) {
				router.push("/login?failed=1");
			}
		};

		if (!isFetched) {
			getGoogleAuthCallback();
		}
	}, [code, state, router, dispatch]);
	return (
		<Flex
			alignItems={"center"}
			justifyContent={"center"}
			height={"100vh"}
			width={"100vw"}
		>
			<Spinner 
				thickness="10px"
				speed="0.65s"
				emptyColor="gray.200"
				color="blue.500"
				height={160}
				width={160}
			/>
		</Flex>
	)
};

interface PageProps {
	code: string;
	state: string;
}

Page.getInitialProps = async (ctx: NextPageContext): Promise<PageProps> => {
	if (ctx.query.code === undefined || ctx.query.state === undefined) {
		ctx.res?.writeHead(302, { location: "/login" });
		ctx.res?.end();
	}

	return {
		code: ctx.query.code as string,
		state: ctx.query.state as string,
	};
};

export default Page;
