import ProductCard from "@/components/ui/ProductCard";
import { colors } from "@/constants/colors";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useAPIInfinite from "@/hooks/useAPIInfinite";
import Layout from "@/layouts/layout";
import { getUserProfile } from "@/services/profile";
import { APIResponse } from "@/types/responses";
import { CategoryHierarchy } from "@/types/responses/category";
import { ProductPaginatedResponse } from "@/types/responses/product";
import { GetUserProfile, defaultGetUserProfile } from "@/types/responses/profile";
import prepareServerSide from "@/utils/prepareServerSide";
import { SessionData, defaultSession } from "@/utils/session";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Grid,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Text,
} from "@chakra-ui/react";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useMemo, useState } from "react";

export default function Page({
	session,
	userProfile,
	initialCategory
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [searchTerm, setSearchTerm] = useState("")
	const [sortBy, setSortBy] = useState("name")
	const [sortAsc, setSortAsc] = useState("ASC")
	const [selectedCategory, selectCategory] = useState(() => initialCategory ?? "all");

	const productFetchPath = useMemo(() => {
		let params: string[] = [];
		if (selectedCategory !== "all") {
			params.push(`category_slug=${selectedCategory}`)
		}
		params.push(`sort_by=${sortBy}`)
		params.push(`sort_type=${sortAsc}`)
		params.push(`term=${searchTerm}`)

		if (session.access_token && searchTerm == "") {
			const location = userProfile.user.locations.find((location) => location.id === userProfile.user.main_location_id)
			params.push(`lat=${location?.coordinate.lat}`)
			params.push(`long=${location?.coordinate.lon}`)
			return "/product?" + params.join("&");
		} 

		return "/product/list?" + params.join("&");
	}, [sortAsc, sortBy, searchTerm, selectedCategory, session.access_token, userProfile.user.locations, userProfile.user.main_location_id]);

  const { data: categoryData } = useAPIFetcher<CategoryHierarchy[]>(
    `/categories/hierarchy`,
    {
      fallbackData: [],
    }
  );

  const hierarchies = categoryData?.data ?? [];

	const { data, size, setSize } = useAPIInfinite<ProductPaginatedResponse>(
		(pageIndex, previousePageData) => {
			if (previousePageData && !previousePageData.products.length) {
				return null;
			}
			return `${productFetchPath}&limit=${10}&page=${pageIndex + 1}`;
		},
		{
			accessToken: session.access_token,
		}
	);
	
	const productList = [];
	const length = data !== undefined ? data.length : 0;

  for (let i = 0; i < length; i++) {
    // @ts-ignore
    const products = data !== undefined ? data[i].data?.products : undefined;
    products && productList.push(...products);
  }

  const showSeeMore =
    data !== undefined &&
    data.length > 0 &&
    (data[data.length - 1].data?.products.length ?? 0) > 0;

	return (
		<Layout>
			<HStack
				width={"full"}
				height={"300px"}
				bg={colors.primary}
				className="px-16 py-12 lg:py-16"
			>
				<Flex
					flexDirection={"column"}
					h={"full"}
					w={"full"}
					justifyContent={"space-between"}
				>
					<Flex flexDirection={"column"} gap={"10px"}>
						<Text fontSize={"36px"} color={colors.white} fontWeight={600}>
							Medishop
						</Text>
						<Text color={colors.white} fontWeight={600}>
							Fast and safe solution for your health needs
						</Text>
					</Flex>
					<InputGroup size="md" bg={colors.white} borderRadius={"20px"}>
						<InputLeftElement bg={"transparent"} pointerEvents="none">
							<Text fontSize={"20px"}>
								<i className="fa-solid fa-magnifying-glass"></i>
							</Text>
						</InputLeftElement>
						<Input
							borderRadius={"10px"}
							placeholder="Search for medicines, vitamins, and other health products"
							onChange={(ev) => setSearchTerm(ev.target.value)}
						/>
						<InputRightElement
							bg={colors.warning}
							color={colors.white}
							fontWeight={700}
							width={"150px"}
							borderRightRadius={"10px"}
							cursor={"pointer"}
						>
							Search
						</InputRightElement>
					</InputGroup>
				</Flex>
			</HStack>
			<Flex
				justifyContent={"end"}
				alignItems={{ base: "start", lg: "center" }}
				gap={"20px"}
				className="my-12 px-5 lg:px-20"
				flexDirection={{ base: "column", lg: "row" }}
			>
				<Text fontWeight={600}>Sort By</Text>
				<Select width={"200px"} size={"md"}
					onChange={(ev) => setSortBy(ev.target.value)}
				>
					<option value="name">Product Name</option>
				</Select>
				<Text fontWeight={600}>Order</Text>
				<Select width={{ base: "200px", lg: "100px" }} size={"md"}
					onChange={(ev) => setSortAsc(ev.target.value)}
				>
					<option value="ASC">Asc</option>
					<option value="DESC">Desc</option>
				</Select>
			</Flex>
			<Flex
				className="mb-24 px-5 lg:px-20"
				h={"full"}
				justifyContent={"space-between"}
				alignItems={"start"}
			>
				<Box
					width={"25%"}
					height={"auto"}
					flexDirection={"column"}
					gap={"30px"}
					className="hidden lg:flex"
				>
					<Card width={"90%"} height={"auto"} className="shadow-2xl p-8">
						<Text fontSize={"18px"} fontWeight={"600"}>
							Category
						</Text>
						<Divider className="mt-4" color={`${colors.secondaryText}70`} />
						<Accordion allowToggle>
							<RadioGroup 
								name="category" 
								value={selectedCategory}
								onChange={(v) => selectCategory(v)}
							>
								<Radio size="md" value="all" pb={4} pt={4}>
									All Categories
								</Radio>
								{hierarchies.map(
									(hierarchy) => {
										const parent = hierarchy.parent;
										return (
											<AccordionItem key={parent.id}>
												<h2>
													<AccordionButton>
														<AccordionIcon />
														<Box as="span" flex="1" textAlign="left">
															{parent.name}
														</Box>
													</AccordionButton>
												</h2>
												<AccordionPanel pb={4} pl={10}>
													<Flex flexDirection={"column"}>
														<Radio
															size="md"
															key={parent.id}
															value={parent.slug}
														>
															{parent.name}
														</Radio>
														{hierarchy.childrens.map(
															(subcategory) => (
																<Radio
																	size="md"
																	key={subcategory.id}
																	value={subcategory.slug}
																>
																	{subcategory.name}
																</Radio>
															)
														)}
													</Flex>
												</AccordionPanel>
											</AccordionItem>
										)
									}
								)}
							</RadioGroup>
						</Accordion>
					</Card>
				</Box>
				<Stack
					width={{ base: "100%", lg: "75%" }}
					className="flex items-center"
				>
					{
						productList.length > 0 ? <>
						 <Grid
						templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }}
						rowGap={"20px"}
					>
						{productList.map((item) => (
							<ProductCard product={item} key={item.id} />
						))}
						</Grid>
						{showSeeMore && (
							<Button
								variant={"brandPrimary"}
								bg={colors.primary}
								color={colors.white}
								w={"150px"}
								fontSize={"14px"}
								className="mt-12"
								onClick={() => setSize(size + 1)}
							>
								See More
							</Button>
						)}
						</> : session.access_token ? <Text>No Product Available in Your Area</Text> : <Text>Product Not Found</Text>
					}
				</Stack>
			</Flex>
		</Layout>
	);
}

type ServerSideProps = {
	session: SessionData;
	userProfile: GetUserProfile;
	initialCategory: string | null;
};

export const getServerSideProps = prepareServerSide((async (context) => {
	const initialCategory = (context.query.category ?? null) as string | null

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

		return {
			props: {
				session: sessionData,
				userProfile: userProfileRes?.data ?? defaultGetUserProfile,
				initialCategory,
			},
		};
	} catch (e) {
		if (e instanceof CookieNotFound) {
			return {
				props: {
					session: defaultSession,
					userProfile: defaultGetUserProfile,
					initialCategory,
				},
			};
		}

		throw e;
	}
}) satisfies GetServerSideProps<ServerSideProps>);