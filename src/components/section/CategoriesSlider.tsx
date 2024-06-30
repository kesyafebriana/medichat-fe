import { colors } from "@/constants/colors";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import { CategoryPaginatedResponse } from "@/types/responses/category";
import { capitalizeEachWord } from "@/utils/transformer";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoriesSlider = () => {
	const { data: categoriesRes, isLoading } =
		useAPIFetcher<CategoryPaginatedResponse>("categories?level=1");
	const categoriesData = categoriesRes?.data?.categories ?? [];
	if (isLoading) return <Spinner color="white" size={"lg"} />;

	return (
		<Flex className="w-3/4" flexDirection={"column"} gap={"30px"}>
			<Text
				color={colors.white}
				fontSize={{ base: "20px", lg: "32px" }}
				fontWeight={600}
			>
				Product Categories
			</Text>
			<div className="swiffy-slider slider-item-show6">
				<ul className="slider-container slider-item-reveal">
					{categoriesData.map((c) => (
						<Link href={`/medishop?category=${c.slug}`} key={c.id}>
							<li className="flex items-center justify-center">
								<Flex
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"center"}
									rowGap={6}
								>
									<Image
										src={c.photo_url}
										alt={c.slug}
										width={100}
										height={100}
									/>
									<Text color={colors.white}>{capitalizeEachWord(c.name)}</Text>
								</Flex>
							</li>
						</Link>
					))}
				</ul>
				<button type="button" className="slider-nav"></button>
				<button type="button" className="slider-nav slider-nav-next"></button>
			</div>
		</Flex>
	);
};

export default CategoriesSlider;
