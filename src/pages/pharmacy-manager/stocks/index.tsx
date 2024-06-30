import StockTable from "@/components/table/StockTable";
import Header from "@/components/ui/Header";
import { pages } from "@/constants/pages";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { SessionData } from "@/utils/session";
import { Flex } from "@chakra-ui/react";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

const Page = ({
	access_token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Header role={role.PHARMACY_MANAGER} />
			<Flex
				flexDirection="row"
				marginTop="25px"
				justifyContent="center"
				paddingX={10}
			>
				<Flex
					width={"100vw"}
					maxH="70vh"
					paddingLeft="0"
					marginRight="20px"
					className="flex flex-col gap-y-5"
				>
					<StockTable access_token={access_token} />
				</Flex>
			</Flex>
		</>
	);
};

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

export default Page;
