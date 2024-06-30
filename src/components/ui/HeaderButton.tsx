import { colors } from "@/constants/colors";
import { pages } from "@/constants/pages";
import { role } from "@/constants/role";
import { useAppSelector } from "@/redux/reduxHook";
import { logoutSession } from "@/services/sessions";
import { Avatar, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function HeaderButton({ role: r }: HeaderPropsType): React.ReactElement {
	const profileState = useAppSelector((state) => state.profile);
	const doctorProfileState = useAppSelector((state) => state.doctorProfile);
	const router = useRouter();

	return (
		<>
			{r === "" && (
				<Flex
					alignItems={"center"}
					className="w-full lg:w-48"
					flexDirection={{ base: "column", lg: "row" }}
					gap={{ base: "10px", lg: "0px" }}
				>
					<Link href={"/login"}>
						<Text fontSize="14px" color={colors.primary} fontWeight={600}>
							Login
						</Text>
					</Link>
					<Spacer />
					<Link href={"/register"}>
						<Button variant={"brandPrimary"} color={"white"} size={"lg"}>
							<Flex alignItems={"center"} gap={"7px"}>
								<Text fontSize="14px">JOIN US</Text>
								<i className="fa-solid fa-arrow-right"></i>
							</Flex>
						</Button>
					</Link>
				</Flex>
			)}
			{r === role.USER && (
				<Flex>
					<Link href={"/profile"}>
						<Avatar src={profileState.photo_url} />
					</Link>
				</Flex>
			)}
			{r === role.DOCTOR && (
				<Flex>
					<Link href={"/profile"}>
						<Avatar src={doctorProfileState.photo_url} />
					</Link>
				</Flex>
			)}
			{r === role.ADMIN && (
				<Flex>
					<Button
						variant={"brandPrimary"}
						onClick={async () => {
							try {
								await logoutSession();
								router.push(pages.LOGIN);
							} catch (e) {}
						}}
					>
						Logout
					</Button>
				</Flex>
			)}
			{r === role.PHARMACY_MANAGER && (
				<Flex>
					<Button
						variant={"brandPrimary"}
						onClick={async () => {
							try {
								await logoutSession();
								router.push(pages.LOGIN);
							} catch (e) {}
						}}
					>
						Logout
					</Button>
				</Flex>
			)}
		</>
	);
}

export default HeaderButton;
