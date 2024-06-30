import OrderTable from "@/components/table/OrderTable";
import Header from "@/components/ui/Header";
import { colors } from "@/constants/colors";
import { OrderStatus } from "@/constants/order";
import { pages } from "@/constants/pages";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { isValidOrderStatus } from "@/types/requests/order";
import { SessionData } from "@/utils/session";
import { capitalizeEachWord } from "@/utils/transformer";
import {
	Card,
	Container,
	Divider,
	Flex,
	Radio,
	RadioGroup,
	Stack,
	Text,
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
					<OrderStatusPicker />
				</Container>
				<Container
					maxW="80vw"
					maxH="70vh"
					paddingLeft="0"
					marginRight="20px"
					className="flex flex-col gap-y-5"
				>
					<Flex alignItems={"center"} justifyContent={"space-between"}>
						<Text fontSize={30} color={colors.primary}>
							Order
						</Text>
					</Flex>
					<OrderTable access_token={access_token} />
				</Container>
			</Flex>
		</>
	);
};

const OrderStatusPicker = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);

	const statusParam = urlParams.get("status");

	if (!statusParam) {
		urlParams.set("status", OrderStatus.WaitingPayment);
	}

	if (statusParam) {
		if (isValidOrderStatus(statusParam)) {
			urlParams.set("status", statusParam);
		} else {
			urlParams.set("status", OrderStatus.WaitingPayment);
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
				Order Status
			</Text>
			<Divider className="my-4" color={"#333"} />
			<RadioGroup
				name="productForm"
				defaultValue={urlParams.get("status") ?? OrderStatus.WaitingPayment}
				onChange={onStatusChange}
			>
				<Stack>
					<Radio size="sm" value={OrderStatus.WaitingPayment}>
						{capitalizeEachWord(OrderStatus.WaitingPayment)}
					</Radio>
					<Radio size="sm" value={OrderStatus.WaitingConfirmation}>
						{capitalizeEachWord(OrderStatus.WaitingConfirmation)}
					</Radio>
					<Radio size="sm" value={OrderStatus.Processing}>
						{capitalizeEachWord(OrderStatus.Processing)}
					</Radio>
					<Radio size="sm" value={OrderStatus.Sent}>
						{capitalizeEachWord(OrderStatus.Sent)}
					</Radio>
					<Radio size="sm" value={OrderStatus.Finished}>
						{capitalizeEachWord(OrderStatus.Finished)}
					</Radio>
					<Radio size="sm" value={OrderStatus.Canceled}>
						{capitalizeEachWord(OrderStatus.Canceled)}
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
