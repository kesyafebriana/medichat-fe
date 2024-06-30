import { pages } from "@/constants/pages";
import { useAppDispatch } from "@/redux/reduxHook";
import { updateProfile } from "@/redux/slice/profileSlice";
import { googleAuthCallback, refreshTokens } from "@/services/auth";
import { getAccountProfile } from "@/services/profile";
import { logoutSession, updateSession } from "@/services/sessions";
import { SessionData } from "@/utils/session";
import { Flex, Spinner } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import React from "react";

let isFetched = false;

const Page = ({ redirect }: PageProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	React.useEffect(() => {
		const refreshTokensCallback = async () => {
			try {
				isFetched = true;
                const res = await refreshTokens();
				if (res?.data) {
					const profileRes = await getAccountProfile(res.data.access_token);
					const accountProfile = profileRes?.data;
					if (profileRes?.data) {
                        const payload: SessionData = {
                            access_token: res.data.access_token,
                            refresh_token: res.data.refresh_token,
                            role: profileRes.data.role,
                            profile_set: profileRes.data.profile_set,
                        };
                        await updateSession(payload);
						dispatch(
							updateProfile({
								id: accountProfile?.id,
								name: accountProfile?.name,
								email: accountProfile?.email,
								email_verified: accountProfile?.email_verified,
								photo_url: accountProfile?.photo_url,
								role: accountProfile?.role,
								account_type: accountProfile?.account_type,
								profile_set: accountProfile?.profile_set,
								date_of_birth: "",
							})
						)
                        if (profileRes.data.profile_set) {
                            router.replace(redirect);
                            return;
                        }
					}
				}
			} catch (e) {
				await logoutSession();
				router.push("/login?failed=1");
			}
		};

		if (!isFetched) {
			refreshTokensCallback();
		}
	}, [redirect, router, dispatch]);
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
    redirect: string;
}

Page.getInitialProps = async (ctx: NextPageContext): Promise<PageProps> => {
	if (ctx.query.redirect === undefined) {
		ctx.res?.writeHead(302, { location: "/login" });
		ctx.res?.end();
	}

	return {
        redirect: ctx.query.redirect as string,
	};
};

export default Page;
