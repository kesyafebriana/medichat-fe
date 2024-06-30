import { Button, Card, Divider, Flex, Text } from "@chakra-ui/react";
import { colors } from "@/constants/colors";
import React, { useState } from "react";
import Layout from "@/layouts/layout";
import { useRouter } from "next/router";
import { pages } from "@/constants/pages";
import AddressManager from "@/components/section/AddressManager";
import TransactionHistory from "@/components/section/TransactionHistory";
import { logoutSession } from "@/services/sessions";
import { useAppDispatch } from "@/redux/reduxHook";
import { resetProfile, updateProfile } from "@/redux/slice/profileSlice";
import {
	GetDoctorProfile,
	GetUserProfile,
	defaultGetDoctorProfile,
	defaultGetUserProfile,
} from "@/types/responses/profile";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import { SessionData, defaultSession } from "@/utils/session";
import { getDoctorProfile, getUserProfile } from "@/services/profile";
import { batchActions } from "@/redux/store";
import { clearLocation, setLocations } from "@/redux/slice/locationSlice";
import { role } from "@/constants/role";
import UserPersonalInformation from "@/components/section/UserPersonalInformation";
import { APIResponse } from "@/types/responses";
import {
	clearDoctorProfile,
	updateDoctorProfileRdx,
} from "@/redux/slice/doctorProfileSlice";
import DoctorPersonalInformation from "@/components/section/DoctorPersonalInformation";
import prepareServerSide from "@/utils/prepareServerSide";

function Page({
	session,
	userProfile,
	doctorProfile,
	subpage: initialSubpage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [subpage, setSubpage] = useState(() => initialSubpage ?? "profile");

	React.useEffect(() => {
		if (session.role === role.USER) {
			dispatch(
				batchActions(
					setLocations({
						main_location_id: userProfile.user.main_location_id,
						locations: userProfile.user.locations,
					}),
					updateProfile({
						name: userProfile.name,
						photo_url: userProfile.photo_url,
						date_of_birth: userProfile.user.date_of_birth,
					})
				)
			);
		} else if (session.role === role.DOCTOR) {
			dispatch(updateDoctorProfileRdx(doctorProfile));
		}
	}, [dispatch, userProfile, session.role, doctorProfile]);

	const onLogout = async () => {
		try {
			await logoutSession();
			router.push(pages.LOGIN);
			dispatch(
				batchActions(resetProfile(), clearLocation(), clearDoctorProfile())
			);
		} catch (e) {}
	};

	return (
		<Layout>
			<Flex
				alignItems={"center"}
				bg={colors.primary}
				height={"150px"}
				w={"full"}
				className="px-8 lg:px-16"
			>
				<Flex gap={"30px"}>
					<Text color={colors.white} fontSize={"32px"} fontWeight={600} onClick={router.back} className="hover:cursor-pointer">
						<i className="fa-solid fa-chevron-left"></i>
					</Text>
					<Text color={colors.white} fontSize={"32px"} fontWeight={600}>
						Personal Data
					</Text>
				</Flex>
			</Flex>
			<Flex
				className="my-8 px-8 lg:px-16"
				justifyContent={"space-between"}
				gap={"20px"}
				w={"full"}
				flexDirection={{ base: "column", lg: "row" }}
			>
				<Card
					width={{ base: "full", lg: "350px" }}
					size={"2xl"}
					className="p-8"
					borderRadius={"8px"}
					color={`${colors.primaryText}90`}
				>
					<Flex flexDirection={"column"} gap={"15px"} fontWeight={600}>
						<Text
							cursor={"pointer"}
							color={
								subpage === "profile"
									? colors.primary
									: `${colors.primaryText}90`
							}
							onClick={() => setSubpage("profile")}
						>
							Profile
						</Text>
						{session.role === role.USER && (
							<>
								<Divider />
								<Text
									cursor={"pointer"}
									color={
										subpage === "manage addresses"
											? colors.primary
											: `${colors.primaryText}90`
									}
									onClick={() => setSubpage("manage addresses")}
								>
									Manage Addresses
								</Text>
								<Divider />
								<Text
									cursor={"pointer"}
									color={
										subpage === "transaction history"
											? colors.primary
											: `${colors.primaryText}90`
									}
									onClick={() => setSubpage("transaction history")}
								>
									Transaction History
								</Text>
							</>
						)}
						<Divider />
						<Button onClick={() => onLogout()}>Logout</Button>
					</Flex>
				</Card>
				<Flex flexDirection={"column"} gap={"20px"} w={"full"} h={"full"}>
					{subpage === "profile" && session.role === role.USER && (
						<UserPersonalInformation />
					)}
					{subpage === "profile" && session.role === role.DOCTOR && (
						<DoctorPersonalInformation />
					)}
					{subpage === "manage addresses" && session.role === role.USER && (
						<AddressManager />
					)}
					{subpage === "transaction history" && session.role === role.USER && (
						<TransactionHistory />
					)}
				</Flex>
			</Flex>
		</Layout>
	);
}

type ServerSideProps = {
	session: SessionData;
	userProfile: GetUserProfile;
	doctorProfile: GetDoctorProfile;
	subpage: string | null;
};

export default Page;

export const getServerSideProps = prepareServerSide((async (context) => {
	const subpage = (context.query.subpage ?? null) as string | null;

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

		let userProfileRes: APIResponse<GetUserProfile> | undefined;
		if (sessionData.role === role.USER) {
			userProfileRes = await getUserProfile(sessionData.access_token);
		}

		let doctorProfileRes: APIResponse<GetDoctorProfile> | undefined;
		if (sessionData.role === role.DOCTOR) {
			doctorProfileRes = await getDoctorProfile(sessionData.access_token);
		}

		return {
			props: {
				session: sessionData,
				userProfile: userProfileRes?.data ?? defaultGetUserProfile,
				doctorProfile: doctorProfileRes?.data ?? defaultGetDoctorProfile,
				subpage,
			},
		};
	} catch (e) {
		throw e;
	}
}) satisfies GetServerSideProps<ServerSideProps>);