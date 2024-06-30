import { colors } from "@/constants/colors";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import ProductCard from "../ui/ProductCard";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import { ProductPaginatedResponse } from "@/types/responses/product";

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

const PopularProducts = () => {
	const today = new Date();
	const popularProductDate = new Date(dummyProducts.date);
	const { data: productRes } = useAPIFetcher<ProductPaginatedResponse>(
		"product/list?limit=5"
	);

	return (
		<Flex className="w-3/4" flexDirection={"column"} gap={"30px"}>
			<Box>
				<Text fontSize={{ base: "20px", lg: "32px" }} fontWeight={600}>
					Most Popular Products
				</Text>
				<Text
					fontSize={{ base: "14px", lg: "20px" }}
					color={colors.secondaryText}
				>
					{popularProductDate.getDate === today.getDate
						? "Today"
						: "All The Time"}
				</Text>
			</Box>
			<div className="swiffy-slider slider-item-show5 slider-item-show2-sm">
				<ul className="slider-container">
					{productRes?.data?.products.map((item) => (
						<li key={item.id}>
							<ProductCard product={item} />
						</li>
					))}
				</ul>
			</div>
			<Flex justifyContent={"center"}>
				<Link href={"/medishop"}>
					<Button
						variant={"brandPrimary"}
						bg={colors.primary}
						fontSize={"14px"}
						color={colors.white}
						width={"200px"}
					>
						See All Products
					</Button>
				</Link>
			</Flex>
		</Flex>
	);
};

export default PopularProducts;
