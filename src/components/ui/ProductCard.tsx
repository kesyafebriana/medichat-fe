import { colors } from "@/constants/colors";
import { Product } from "@/types/responses/product";
import { Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function ProductCard({ product }: ProductCardProps): React.ReactElement {
	return (
		<Link href={`medishop/${product.slug}`}>
			<Card
				size={"md"}
				h={{ base: "350px", lg: "450px" }}
				w={{ lg: "250px" }}
				className="shadow-2xl p-4"
			>
				<Flex
					flexDirection={"column"}
					justifyContent={"center"}
					alignItems={"center"}
					gap={"10px"}
					h={"100%"}
					w={"100%"}
				>
					<Image
						src={product.photo_url}
						alt="Medicine"
						width={{ base: "150px", lg: "240px" }}
						height={{ base: "150px", lg: "240px" }}
						objectFit={"contain"}
						border={`0.5px solid ${colors.secondaryText}20`}
						borderRadius={"8px"}
					/>
					<Flex
						flexDirection={"column"}
						justifyContent={"space-between"}
						h={"100%"}
						w={"100%"}
					>
						<Flex flexDirection={"column"} gap={"5px"}>
							<Text fontWeight={600}>
								{product.name.length < 40
									? product.name
									: product.name.substring(0, 40) + "..."}
							</Text>
							{/* <Text fontSize={"14px"} color={colors.secondaryText}>
								per {item.packaging}
							</Text>
							<Text fontSize={"14px"} fontWeight={600}>
								Rp {item.floorPrice} - Rp {item.ceilingPrice}
							</Text> */}
						</Flex>
						<Button
							variant={"brandPrimary"}
							color={colors.white}
							bg={colors.primary}
							fontSize={"14px"}
						>
							See Details
						</Button>
					</Flex>
				</Flex>
			</Card>
		</Link>
	);
}

interface ProductCardProps {
	product: Product;
}

export default ProductCard;
