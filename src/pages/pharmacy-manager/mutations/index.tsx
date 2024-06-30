import MutationTable from "@/components/table/MutationTable";
import Header from "@/components/ui/Header";
import { MutationMethod, MutationStatus } from "@/constants/mutation";
import { pages } from "@/constants/pages";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { isValidMutationMethod, isValidMutationStatus } from "@/utils/checker";
import { SessionData } from "@/utils/session";
import { capitalizeEachWord } from "@/utils/transformer";
import {
	Card,
	Container,
	Flex,
	Text,
	Divider,
	RadioGroup,
	Radio,
	Stack,
} from "@chakra-ui/react";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const Page = ({
	access_token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<>
			<Header role={role.PHARMACY_MANAGER} />
			<Flex
				maxW="100vw"
				flexDirection="row"
				marginTop="25px"
				justifyContent="center"
			>
				<Container
					maxW="20vw"
					paddingRight="0"
					marginLeft="20px"
					display="flex"
					flexDirection="column"
					gap="20px"
				>
					<MutationStatusPicker />
					<MutationMethodPicker />
				</Container>
				<Container
					maxW="80vw"
					maxH="70vh"
					paddingLeft="0"
					marginRight="20px"
					className="flex flex-col gap-y-5"
				>
					<MutationTable access_token={access_token} />
				</Container>
			</Flex>
		</>
	);
};

const MutationStatusPicker = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);

	const statusParam = urlParams.get("status");

	if (!statusParam) {
		urlParams.set("status", MutationStatus.Pending);
	}

	if (statusParam) {
		if (isValidMutationStatus(statusParam)) {
			urlParams.set("status", statusParam);
		} else {
			urlParams.set("status", MutationStatus.Pending);
		}
	}

	const onStatusChange = (nextValue: string) => {
		urlParams.set("status", nextValue);
		urlParams.set("page", "1");
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	return (
		<Card
			width={"90%"}
			height={"auto"}
			className="shadow-2xl p-8"
			border="1px solid rgba(122,122,122,.5)"
		>
			<Text fontSize={"18px"} fontWeight={"600"}>
				Mutation Status
			</Text>
			<Divider className="my-4" color={"#333"} />
			<RadioGroup
				name="mutationStatus"
				defaultValue={urlParams.get("status") ?? MutationStatus.Pending}
				onChange={onStatusChange}
			>
				<Stack>
					<Radio size="sm" value={MutationStatus.Pending}>
						{capitalizeEachWord(MutationStatus.Pending)}
					</Radio>
					<Radio size="sm" value={MutationStatus.Approved}>
						{capitalizeEachWord(MutationStatus.Approved)}
					</Radio>
					<Radio size="sm" value={MutationStatus.Cancelled}>
						{capitalizeEachWord(MutationStatus.Cancelled)}
					</Radio>
				</Stack>
			</RadioGroup>
		</Card>
	);
};

const MutationMethodPicker = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);

	const methodParam = urlParams.get("method");

	let method = MutationMethod.All;
	if (methodParam && isValidMutationMethod(methodParam)) {
		method = methodParam;
		urlParams.set("method", methodParam);
	}

	if (methodParam && !isValidMutationMethod(methodParam)) {
		urlParams.delete("method", methodParam);
	}

	const onMethodChange = (nextValue: string) => {
		if (nextValue === MutationMethod.All) {
			urlParams.delete("method");
			router.replace(`${pathname}?${urlParams.toString()}`);
			return;
		}
		urlParams.set("method", nextValue);
		urlParams.set("page", "1");
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	return (
		<Card
			width={"90%"}
			height={"auto"}
			className="shadow-2xl p-8"
			border="1px solid rgba(122,122,122,.5)"
		>
			<Text fontSize={"18px"} fontWeight={"600"}>
				Mutation Method
			</Text>
			<Divider className="my-4" color={"#333"} />
			<RadioGroup
				name="mutationMethod"
				defaultValue={method}
				onChange={onMethodChange}
			>
				<Stack>
					<Radio size="sm" value={MutationMethod.All}>
						{capitalizeEachWord(MutationMethod.All)}
					</Radio>
					<Radio size="sm" value={MutationMethod.Automatic}>
						{capitalizeEachWord(MutationMethod.Automatic)}
					</Radio>
					<Radio size="sm" value={MutationMethod.Manual}>
						{capitalizeEachWord(MutationMethod.Manual)}
					</Radio>
				</Stack>
			</RadioGroup>
		</Card>
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
