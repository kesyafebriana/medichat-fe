import { colors } from "@/constants/colors";
import Layout from "@/layouts/layout";
import { Box, Flex, HStack, Text, Button } from "@chakra-ui/react";
import React from "react";
import Banner1 from "../../../public/assets/img/banner-1.jpeg";
import Banner2 from "../../../public/assets/img/banner-2.jpeg";
import Banner3 from "../../../public/assets/img/banner-3.jpeg";
import ImageSlider from "@/components/ui/ImageSlider";
import DoctorIllustration1 from "../../../public/assets/img/doctor-illustration.png";
import DoctorIllustration2 from "../../../public/assets/img/doctor-illustration-2.png";
import HomepageCard from "@/components/ui/HomepageCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unsealData } from "iron-session";
import { getAccountProfile } from "@/services/profile";
import { SessionData } from "@/utils/session";
import { useAppDispatch } from "@/redux/reduxHook";
import { updateProfile } from "@/redux/slice/profileSlice";
import {
	AccountProfile,
	defaultAccountProfile,
} from "@/types/responses/profile";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import CategoriesSlider from "@/components/section/CategoriesSlider";
import PopularProducts from "@/components/section/PopularProducts";
import prepareServerSide from "@/utils/prepareServerSide";

const items = [
	{
		img: Banner1,
		desc: "Omnichannel",
	},
	{
		img: Banner2,
		desc: "Multilingual",
	},
	{
		img: Banner3,
		desc: "Interpolate",
	},
];

const dummyProducts = {
	date: "2024-04-16",
	data: [
		{
			id: 1,
			name: "Episan Suspensi 100ml",
			floorPrice: 10000,
			ceilingPrice: 30000,
			packaging: "botol",
			slug: "episan-suspensi-100ml-1",
			image:
				"https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
		},
		{
			id: 2,
			name: "Omeprazole 20 mg 3 Strip(10 Kapsul/Strip PALING MURAH",
			floorPrice: 10000,
			ceilingPrice: 30000,
			packaging: "strip",
			slug: "omeprazole-20-mg-3-strip-1",
			image:
				"https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
		},
		{
			id: 3,
			name: "Paracetamol 500mg",
			floorPrice: 10000,
			ceilingPrice: 30000,
			packaging: "strip",
			slug: "paracetamol-500mg-1",
			image:
				"https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
		},
		{
			id: 4,
			name: "Episan Suspensi 100ml",
			floorPrice: 10000,
			ceilingPrice: 30000,
			packaging: "botol",
			slug: "episan-suspensi-100ml-2",
			image:
				"https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
		},
		{
			id: 5,
			name: "Episan Suspensi 100ml",
			floorPrice: 10000,
			ceilingPrice: 30000,
			packaging: "botol",
			slug: "episan-suspensi-100ml-3",
			image:
				"https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
		},
	],
};

export default function Page({
	accountProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const today = new Date();
	const dispatch = useAppDispatch();
	const popularProductDate = new Date(dummyProducts.date);

	React.useLayoutEffect(() => {
		dispatch(
			updateProfile({
				id: accountProfile.id,
				name: accountProfile.name,
				email: accountProfile.email,
				email_verified: accountProfile.email_verified,
				photo_url: accountProfile.photo_url,
				role: accountProfile.role,
				account_type: accountProfile.account_type,
				profile_set: accountProfile.profile_set,
				date_of_birth: "",
			})
		);
	}, [accountProfile, dispatch]);

	return (
		<Layout>
			<HStack height={{ base: "100%", lg: "450px" }} bg={colors.secondary}>
				<ImageSlider items={items} />
			</HStack>
			<Flex
				alignItems={"center"}
				justifyContent={"center"}
				className="w-full"
				flexDirection={"column"}
			>
				<Flex
					alignItems={"center"}
					justifyContent={"space-between"}
					className="w-3/4 my-12 lg:my-24"
					gap={"50px"}
					flexDirection={{ base: "column", lg: "row" }}
				>
					<HomepageCard
						link="/doctors"
						img={DoctorIllustration1}
						title="Chat with Our Doctors"
						desc="Online consultation with doctors from different specialties"
					/>
					<HomepageCard
						link="/medishop"
						img={DoctorIllustration2}
						title="Find your Medicines"
						desc="Sells many types of medicines and medical equipment."
					/>
				</Flex>
				<Flex
					flexDirection={"column"}
					h={"300px"}
					w={"full"}
					bg={colors.primary}
					className="w-3/4"
					alignItems={"center"}
					justifyContent={"center"}
					borderTopRadius={{ base: "20px", lg: "40px" }}
				>
					<CategoriesSlider />
				</Flex>
				<Flex
					flexDirection={"column"}
					w={"full"}
					alignItems={"center"}
					justifyContent={"center"}
					className="my-12 lg:my-20"
				>
					<PopularProducts />
				</Flex>
			</Flex>
		</Layout>
	);
}

type ServerSideProps = {
	accountProfile: AccountProfile;
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

		const accountProfileRes = await getAccountProfile(sessionData.access_token);

		return {
			props: {
				accountProfile: accountProfileRes?.data ?? defaultAccountProfile,
			},
		};
	} catch (e) {
		return {
			props: {
				accountProfile: defaultAccountProfile,
			},
		};
	}
}) satisfies GetServerSideProps<ServerSideProps>;
