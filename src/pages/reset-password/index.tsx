import React from "react";
import Image from "next/image";
import logo from "../../../public/assets/svg/logo.svg";
import loginImage from "../../../public/assets/img/login-img.png";
import { Box, Flex, HStack, Text, VStack, useToast } from "@chakra-ui/react";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import { NextPageContext } from "next";
import { checkResetPasswordToken } from "@/services/auth";
import Head from "next/head";

const expiredToast = "expired-toast";

const Page = ({ email, token, isValid }: PageProps) => {
	const toast = useToast();

	React.useEffect(() => {
		if (!isValid) {
			toast({
				id: expiredToast,
				title: "Expired",
				description: "Reset password token expired",
				status: "error",
				isClosable: true,
				duration: null,
				position: "top-right",
			});
		}
	}, [isValid, toast]);

	return (
		<>
			<Head>
				<title>Reset Password</title>
			</Head>
			<Flex className="min-h-[100vh] lg:flex-row lg:items-center lg:justify-center lg:gap-x-8">
				<Flex
					className="w-full max-w-[550px] lg:rounded-[40px] lg:border lg:shadow-lg"
					paddingX={6}
					paddingY={10}
					direction={"column"}
					rowGap={{ base: 6, lg: 10 }}
				>
					<HStack columnGap={4}>
						<Text className="hidden lg:block">Welcome to</Text>
						<Image src={logo} alt="medichat-logo" className="mx-auto lg:mx-0" />
					</HStack>
					<VStack alignItems={"start"}>
						<Text fontSize={40}>Set New Password</Text>
						<Text color={"#475467"} maxWidth={"60%"}>
							Your new password must be different to previously used passwords.
						</Text>
					</VStack>
					<ResetPasswordForm email={email} token={token} isValid={isValid} />
				</Flex>
				<Box className="hidden lg:block">
					<Image src={loginImage} alt="" />
				</Box>
			</Flex>
		</>
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
		ctx.query.reset_password_token === undefined
	) {
		ctx.res?.writeHead(302, {
			location: "/forgot-password",
		});
		ctx.res?.end();
	}

	try {
		await checkResetPasswordToken({
			email: ctx.query.email as string,
			reset_password_token: ctx.query.reset_password_token as string,
		});

		return {
			email: ctx.query.email,
			token: ctx.query.reset_password_token,
			isValid: true,
		};
	} catch (e) {
		return {
			email: ctx.query.email,
			token: ctx.query.reset_password_token,
			isValid: false,
		};
	}
};

export default Page;
