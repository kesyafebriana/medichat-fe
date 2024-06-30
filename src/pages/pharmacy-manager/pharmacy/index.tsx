import React from "react";
import { Flex } from "@chakra-ui/react";
import Header from "@/components/ui/Header";
import { role } from "@/constants/role";
import PharmacyTable from "@/components/table/PharmacyTable";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import { SessionData } from "@/utils/session";
import { pages } from "@/constants/pages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function Page({
	access_token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Header role={role.PHARMACY_MANAGER} />
			<Flex flexDirection="row" marginTop="25px" justifyContent="center">
				<Flex
					width="100vw"
					maxH="70vh"
					paddingLeft="0"
					marginRight="20px"
					paddingX={10}
					className="flex flex-col gap-y-5"
				>
					<PharmacyTable access_token={access_token} />
				</Flex>
			</Flex>
		</>
	);
}

type ServerSideProps = {
	access_token: string;
};

export const getServerSideProps = (async (context) => {
	try {
		const cookie = context.req.headers.cookie;

		const cSession = cookie
			?.split("; ")
			.find((s) => s.startsWith(`${process.env.COOKIE_NAME}=`))
			?.split("=")[1];

		if (!cSession) {
			throw new CookieNotFound();
		}

		const sessionData = await unsealData<SessionData>(cSession!!, {
			password: process.env.SESSION_SECRET as string,
		});

		return {
			props: {
				access_token: sessionData.access_token,
			},
		};
	} catch (e) {
		if (e instanceof CookieNotFound) {
			context.res.writeHead(307, { location: `/vm1/${pages.LOGIN}` });
			context.res.end();
		}
		return {
			props: {
				access_token: "",
			},
		};
	}
}) satisfies GetServerSideProps<ServerSideProps>;
