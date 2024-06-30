import { Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import logo from "../../../public/assets/svg/logo.svg";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SessionData, defaultSession } from "@/utils/session";
import { unsealData } from "iron-session";
import {
	AccountProfile,
	defaultAccountProfile,
} from "@/types/responses/profile";
import { getAccountProfile, getSpecializations } from "@/services/profile";
import SetUserProfileForm from "@/components/form/SetUserProfileForm";
import { role } from "@/constants/role";
import SetDoctorProfileForm from "@/components/form/SetDoctorProfileForm";
import { Specialization } from "@/types/requests/profile";

const Page = ({
	session,
	specializations,
	accountProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
						Set Your Profile
					</Text>
				</Flex>
				{accountProfile.role === role.USER && (
					<SetUserProfileForm
						session={session}
						accountProfile={accountProfile}
					/>
				)}
				{accountProfile.role === role.DOCTOR && (
					<SetDoctorProfileForm
						specializations={specializations}
						session={session}
						accountProfile={accountProfile}
					/>
				)}
			</Flex>
		</Flex>
	);
};

export default Page;

type ServerSideProps = {
	session: SessionData;
	accountProfile: AccountProfile;
	specializations: Specialization[];
};

export const getServerSideProps = (async (context) => {
	try {
		const cookie = context.req.headers.cookie
			?.split("; ")
			.find((s) => s.startsWith(`${process.env.COOKIE_NAME}=`))
			?.split("=")[1];

		if (!cookie) {
		}

		const data = await unsealData<SessionData>(cookie!!, {
			password: process.env.SESSION_SECRET as string,
		});

		const accountProfileRes = await getAccountProfile(data.access_token);

		let specializations: Specialization[] | undefined = [];
		if (accountProfileRes?.data?.role === role.DOCTOR) {
			const res = await getSpecializations();
			if (res) specializations = res.data;
		}

		return {
			props: {
				session: data,
				accountProfile: accountProfileRes?.data!!,
				specializations: specializations ?? [],
			},
		};
	} catch (e) {
		return {
			props: {
				session: defaultSession,
				accountProfile: defaultAccountProfile,
				specializations: [],
			},
		};
	}
}) satisfies GetServerSideProps<ServerSideProps>;
