import { Flex, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../../public/assets/svg/logo.svg";
import VerificationForm from "@/components/form/VerificationForm";
import React from "react";
import { NextPageContext } from "next";
import { checkVerifyToken, getVerifyToken } from "@/services/auth";

const expiredToast = "expired-toast";
const resendTokenToast = "resend-toast";

const Page = ({ email, token, isValid }: PageProps) => {
	const [isResend, setIsResend] = React.useState<boolean>(false);
	const toast = useToast();

	React.useEffect(() => {
		if (!isValid && !isResend && !toast.isActive(expiredToast)) {
			toast({
				id: expiredToast,
				title: "Expired",
				description: "Verification token expired",
				status: "error",
				isClosable: true,
				duration: null,
				position: "top-right",
			});
		}
	}, [isValid, toast, isResend]);

	const onReGetVerifyToken = async () => {
		try {
			toast.close(expiredToast);
			setIsResend(true);
			await getVerifyToken({
				email: email,
			});
			toast({
				id: resendTokenToast,
				title: "Email verification was sent.",
				description: "Please check your email for verify account",
				status: "success",
				isClosable: true,
				duration: null,
				position: "top-right",
			});
		} catch (e) {
			toast({
				title: "Server encounter error.",
				description: "failed to sent email verification",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	return (
		<Flex className="min-h-[100vh] lg:flex-row lg:items-center lg:justify-center lg:gap-x-8">
			<Flex
				className="w-full max-w-[550px] lg:rounded-[40px] lg:border lg:shadow-lg"
				paddingX={6}
				paddingY={10}
				direction={"column"}
				rowGap={{ base: 6, lg: 10 }}
			>
				<Flex
					gap={4}
					alignItems={"center"}
					justifyContent={"center"}
					flexDirection={"column"}
				>
					<HStack columnGap={4}>
						<Text className="hidden lg:block">Welcome to</Text>
						<Image src={logo} alt="medichat-logo" className="mx-auto lg:mx-0" />
					</HStack>
					<Text fontSize={"40px"} fontWeight={600}>
						Verify Your Account
					</Text>
				</Flex>
				<Stack>
					<VerificationForm email={email} token={token} isValid={isValid} />
					{!isValid && (
						<Flex className="text-sm text-gray-400" columnGap={1}>
							<Text>verification token expired?</Text>
							<Text
								as={"u"}
								className="hover:cursor-pointer"
								onClick={onReGetVerifyToken}
							>
								send again.
							</Text>
						</Flex>
					)}
				</Stack>
			</Flex>
		</Flex>
	);
};

interface PageProps {
	email: string;
	token: string;
	isValid: boolean;
}

Page.getInitialProps = async (ctx: NextPageContext) => {
	if (
		ctx.query.email === undefined ||
		ctx.query.verify_email_token === undefined
	) {
		ctx.res?.writeHead(302, {
			location: "/register",
		});
		ctx.res?.end();
	}

	try {
		await checkVerifyToken({
			email: ctx.query.email as string,
			verify_email_token: ctx.query.verify_email_token as string,
		});

		return {
			email: ctx.query.email,
			token: ctx.query.verify_email_token,
			isValid: true,
		};
	} catch (e) {
		return {
			email: ctx.query.email,
			token: ctx.query.verify_email_token,
			isValid: false,
		};
	}
};

export default Page;
