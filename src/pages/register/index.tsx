import { Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import logo from "../../../public/assets/svg/logo.svg";
import loginImg from "../../../public/assets/img/login-img.png";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Page = () => {
	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<Flex
				h={"100vh"}
				justifyContent={"space-around"}
				alignItems={"center"}
				flexDirection={"column"}
			>
				<HStack columnGap={4}>
					<Text className="hidden lg:block">Welcome to</Text>
					<Image src={logo} alt="medichat-logo" className="mx-auto lg:mx-0" />
				</HStack>
				<Image src={loginImg} alt="login-illustration" className="lg:w-1/4" />
				<VStack rowGap={30}>
					<Text fontSize={"30px"} fontWeight={600}>
						Sign up as
					</Text>
					<Flex
						gap={{ base: 5, lg: 10 }}
						flexDirection={{ base: "column", lg: "row" }}
					>
						<Link href={"doctor/register"}>
							<Button w={40} variant={"brandPrimary"}>
								Doctor
							</Button>
						</Link>
						<Link href={"user/register"}>
							<Button w={40} variant={"brandPrimary"}>
								User
							</Button>
						</Link>
					</Flex>
				</VStack>
			</Flex>
		</>
	);
};

export default Page;
