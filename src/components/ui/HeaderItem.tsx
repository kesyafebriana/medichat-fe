import { colors } from "@/constants/colors";
import { role } from "@/constants/role";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function HeaderItem({ role: r }: HeaderPropsType): React.ReactElement {
	const router = useRouter();

	return (
		<>
			{(r === role.USER || r === "") && (
				<Flex
					className=""
					gap={{ base: "20px", lg: "16px" }}
					flexDirection={{ base: "column", lg: "row" }}
				>
					<Link href={"/home"}>
						<Text
							fontSize="14px"
							color={
								router.asPath === "/home"
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Home
						</Text>
					</Link>
					<Link href={"/doctors"}>
						<Text
							fontSize="14px"
							color={
								router.asPath === "/doctors"
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Doctors
						</Text>
					</Link>
					<Link href={"/medishop"}>
						<Text
							fontSize="14px"
							color={
								router.asPath === "/medishop"
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Medishop
						</Text>
					</Link>
					{r === role.USER && (
						<Link href={"/chats"}>
							<Text
								fontSize="14px"
								color={
									router.asPath === "/chats"
										? colors.primary
										: colors.secondaryText
								}
								fontWeight={600}
								className={`hover:text-[${colors.primary}]`}
							>
								Chats
							</Text>
						</Link>
					)}
				</Flex>
			)}
			{r === role.DOCTOR && (
				<Flex
					className=""
					gap={{ base: "20px", lg: "16px" }}
					flexDirection={{ base: "column", lg: "row" }}
				>
					<Link href={"/home"}>
						<Text
							fontSize="14px"
							color={
								router.asPath === "/home"
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Home
						</Text>
					</Link>
					<Link href={"/chats"}>
						<Text
							fontSize="14px"
							color={
								router.asPath === "/chats"
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Chats
						</Text>
					</Link>
				</Flex>
			)}
			{r === role.ADMIN && (
				<Flex
					className=""
					gap={{ base: "20px", lg: "16px" }}
					flexDirection={{ base: "column", lg: "row" }}
				>
					<Link href={"/admin/product"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.startsWith("/admin/product")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Product
						</Text>
					</Link>
					<Link href={"/admin/categories"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.startsWith("/admin/categories")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Category
						</Text>
					</Link>
					<Link href={"/admin/orders"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.startsWith("/admin/orders")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Order
						</Text>
					</Link>
					<Link href={"/admin/partners"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.startsWith("/admin/partners")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Partner
						</Text>
					</Link>
				</Flex>
			)}
			{r === role.PHARMACY_MANAGER && (
				<Flex
					className=""
					gap={{ base: "20px", lg: "16px" }}
					flexDirection={{ base: "column", lg: "row" }}
				>
					<Link href={"/pharmacy-manager/orders"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.includes("/pharmacy-manager/orders")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Orders
						</Text>
					</Link>
					<Link href={"/pharmacy-manager/stocks"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.includes("/pharmacy-manager/stocks")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Stock
						</Text>
					</Link>
					<Link href={"/pharmacy-manager/mutations"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.includes("/pharmacy-manager/mutations")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Mutation
						</Text>
					</Link>
					<Link href={"/pharmacy-manager/pharmacy"}>
						<Text
							fontSize="14px"
							color={
								router.asPath.includes("/pharmacy-manager/pharmacy")
									? colors.primary
									: colors.secondaryText
							}
							fontWeight={600}
							className={`hover:text-[${colors.primary}]`}
						>
							Pharmacies
						</Text>
					</Link>
				</Flex>
			)}
		</>
	);
}

export default HeaderItem;
