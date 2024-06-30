import React from "react";
import Image from "next/image";
import logo from "../../../../public/assets/svg/logo.svg";
import loginImage from "../../../../public/assets/img/login-img.png";
import RegisterForm from "@/components/form/RegisterForm";
import { Box, Flex, HStack, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/constants/colors";
import { NextPageContext } from "next";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import { FormState, defaultFormState } from "@/types/form";
import FormError from "@/components/form/FormError";
import { googleAuth } from "@/services/auth";
import Head from "next/head";
import NextLink from "next/link";

const Page = ({ slug }: PageParams) => {
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onGoogleRegister = async () => {
		try {
			setFormState((prev) => ({
				...prev,
				isLoading: true,
			}));
			const res = await googleAuth();
			window.open(res?.data, "_self");
		} catch (e) {
			setFormState((prev) => ({
				...prev,
				errorMessage: "server encounter error.",
			}));
		} finally {
			setFormState((prev) => ({
				...prev,
				isLoading: false,
			}));
		}
	};

	return (
		<>
			<Head>
				<title>Register as {slug}</title>
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
						<Text fontSize={40}>Sign Up</Text>
						{slug === "user" && (
							<Stack width={"100%"}>
								<GoogleAuthButton
									isLoading={formState.isLoading}
									onClick={onGoogleRegister}
									variant="Sign up"
								/>
								{formState.errorMessage && (
									<FormError>{formState.errorMessage}</FormError>
								)}
							</Stack>
						)}
					</VStack>
					<RegisterForm role={slug} />
					<VStack alignItems={"start"} fontSize={13} rowGap={0}>
						<Text color={colors.secondaryText}>Have an Account ?</Text>
						<Link
							as={NextLink}
							color={colors.primary}
							fontWeight={"bold"}
							href="/login"
						>
							Sign In
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

interface PageParams {
	slug: string;
}

Page.getInitialProps = async (ctx: NextPageContext) => {
	if (ctx.query.slug !== "user" && ctx.query.slug !== "doctor") {
		ctx.res?.writeHead(302, { location: "/user/register" });
		ctx.res?.end();
	}
	return { slug: ctx.query.slug };
};

export default Page;
