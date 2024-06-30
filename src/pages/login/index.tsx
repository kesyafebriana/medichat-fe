import React from "react";
import Image from "next/image";
import {
	Box,
	Flex,
	HStack,
	Link,
	Stack,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import logo from "../../../public/assets/svg/logo.svg";
import loginImage from "../../../public/assets/img/login-img.png";
import { colors } from "@/constants/colors";
import LoginForm from "@/components/form/LoginForm";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import { FormState, defaultFormState } from "@/types/form";
import { googleAuth } from "@/services/auth";
import FormError from "@/components/form/FormError";
import { NextPageContext } from "next";
import Head from "next/head";
import NextLink from "next/link";

const toastId = "login-toast";

function Page({ loginFailed }: PageProps) {
	const toast = useToast();
	React.useEffect(() => {
		if (loginFailed && !toast.isActive(toastId)) {
			toast({
				id: toastId,
				title: "Login",
				description: "Login failed, please try again later...",
				status: "error",
				duration: null,
				isClosable: true,
				position: "top-right",
			});
		}
	}, [loginFailed, toast]);
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onGoogleLogin = async () => {
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
				<title>Login</title>
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
						<Text fontSize={40}>Sign In</Text>
						<Stack width={"100%"}>
							<GoogleAuthButton
								isLoading={formState.isLoading}
								onClick={onGoogleLogin}
								variant="Sign in"
							/>
							{formState.errorMessage && (
								<FormError>{formState.errorMessage}</FormError>
							)}
						</Stack>
					</VStack>
					<LoginForm />
					<VStack alignItems={"start"} fontSize={13} rowGap={0}>
						<Text color={colors.secondaryText}>No Account ?</Text>
						<Link
							as={NextLink}
							color={colors.primary}
							fontWeight={"bold"}
							href="/register"
						>
							Sign Up
						</Link>
					</VStack>
				</Flex>
				<Box className="hidden lg:block">
					<Image src={loginImage} alt="" />
				</Box>
			</Flex>
		</>
	);
}

interface PageProps {
	loginFailed: boolean;
}

Page.getInitialProps = async (ctx: NextPageContext): Promise<PageProps> => {
	const loginFailed = ctx.query.failed === "1";
	return {
		loginFailed,
	};
};

export default Page;
