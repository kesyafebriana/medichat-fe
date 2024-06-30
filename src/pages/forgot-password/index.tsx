import React from "react";
import Image from "next/image";
import logo from "../../../public/assets/svg/logo.svg";
import loginImage from "../../../public/assets/img/login-img.png";
import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/constants/colors";
import ForgotPasswordForm from "@/components/form/ForgotPasswordForm";
import Head from "next/head";

const Page = () => {
	return (
		<>
			<Head>
				<title>Forget Password</title>
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
					<VStack alignItems={"start"} rowGap={6}>
						<Text fontSize={40}>Forgot Password</Text>
					</VStack>
					<ForgotPasswordForm />
					<VStack alignItems={"start"} fontSize={13} rowGap={0}>
						<Link color={colors.primary} fontWeight={"bold"} href="/login">
							Back to login
						</Link>
					</VStack>
				</Flex>
				<Box className="hidden lg:block">
					<Image src={loginImage} alt="" />
				</Box>
			</Flex>
		</>
	);
};

export default Page;
