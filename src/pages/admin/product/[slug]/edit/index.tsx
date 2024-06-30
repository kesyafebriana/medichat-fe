import Header from "@/components/ui/Header";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { useRouter } from "next/router";
import { editProduct } from "@/services/admin";
import { getProductBySlug } from "@/services/product";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Image,
	Input,
	Stack,
	Text,
	useToast
} from "@chakra-ui/react";
import useSession from "@/hooks/useSession";
import { ProductWithDetails } from "@/types/responses/product";

const Page = ({ productRedirect }: AddProductProps) => {
	const [data, setData] = useState<ProductWithDetails | undefined>();
	const router = useRouter();
	const { slug } = router.query;
	const session = useSession();
	const toast = useToast();

	useEffect(() => {
		if (data) {
			setFormData({
				name: data.name || "",
				image: data.photo_url || "",
				description: data.product_detail.description || "",
				generic_name: data.product_detail.generic_name || "",
				composition: data.product_detail.composition || "",
				content: data.product_detail.content || "",
				category_id: data.category_id || 0,
				product_form: data.product_detail.product_form || "",
				product_classification: data.product_detail.product_classification || "",
				unit_in_pack: data.product_detail.unit_in_pack || "",
				manufacturer: data.product_detail.manufacturer || "",
				selling_unit: data.product_detail.selling_unit || "",
				weight: data.product_detail.weight || 0,
				width: data.product_detail.width || 0,
				height: data.product_detail.height || 0,
				length: data.product_detail.length || 0,
			});
		}
	}, [data]);

	const [image, setImage] = useState("");
	const [imgFile, setImgFile] = useState<File | undefined>(undefined);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		const getProduct = async () => {
			try {
				const res = await getProductBySlug(slug as string, session.session?.access_token ?? "");
				setData(res?.data);
			} catch (e) {}
		};

		getProduct();
	}, [slug, session.session?.access_token]);

	const [formData, setFormData] = useState({
		name: "",
		image: "",
		description: "",
		generic_name: "",
		composition: "",
		content: "",
		category_id: 0,
		product_form: "",
		product_classification: "",
		unit_in_pack: "",
		manufacturer: "",
		selling_unit: "",
		weight: 0,
		width: 0,
		height: 0,
		length: 0,
	});

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setImgFile(file)
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await editProductData(formData);
		router.replace({
			pathname: "/admin/product/[id]",
			query: { id: slug },
		});
	};

	function backPage() {
		router.replace("/admin/product");
	  }

	const editProductData = async (values: typeof formData) => {
		try {
			await editProduct(session.session?.access_token ?? "", { ...values, picture: imgFile}, slug);
			toast({
				title: "Update Product",
				description: "Successfully update product",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			  });
			  setTimeout(backPage, 3000);
		} catch (e) {
			toast({
				title: "Update Product",
				description: `Update product failed because ${e}`,
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			  });
		}
	};

	return (
		<>
			<Header role="admin" />
			<HStack>
				<HStack
					width={"full"}
					height={"200px"}
					bg={colors.primary}
					className="py-12 lg:py-16 relative"
				>
					<Flex
						className="absolute lg:top-1/3 pt-20 lg:pt-0 px-8 lg:px-16"
						gap={"30px"}
						w={"full"}
						h={"300px"}
						flexDirection={{ base: "column", lg: "row" }}
					>
						<Box
							backgroundImage={formData.image}
							width={{ base: "full", lg: "300px" }}
							height={{ base: "full", lg: "300px" }}
							objectFit={"contain"}
							className="shadow-lg"
							borderRadius={"8px"}
							maxW={{ lg: "20%" }}
						>
							<Image
								width={"300px"}
								height={"300px"}
								borderRadius={"8px"}
								objectFit={"fill"}
								src={image}
								alt=""
							/>
						</Box>

						<Flex
							flexDirection={"column"}
							justifyContent={"space-between"}
							w={"80%"}
							h={"300px"}
						>
							<Flex
								flexDirection={"column"}
								justifyContent={"space-around"}
								h={"250px"}
								gap={"30px"}
							>
								<FormControl>
									<FormLabel
										color={colors.white}
										fontSize={"28px"}
										fontWeight={600}
									>
										Name
									</FormLabel>
									<Input
										type="text"
										name="name"
										color={{ base: colors.primaryText, lg: colors.white }}
										fontSize={{ base: "24px", lg: "32px" }}
										fontWeight={600}
										value={formData.name}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Flex>
							<Flex
								justifyContent={"space-between"}
								w={{ lg: "full" }}
								h={"full"}
								alignItems={"center"}
								flexDirection={{ base: "column", lg: "row" }}
								gap={{ base: "20px", lg: "0px" }}
							>
								<Flex
									flexDirection={"column"}
									w={{ lg: "400px" }}
									h={"full"}
									justifyContent={"space-around"}
								>
									<Divider />
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</HStack>
			</HStack>
			<form onSubmit={handleSubmit}>
				<Stack
					mt={{ base: "430px", lg: "200px" }}
					mb={{ lg: "50px" }}
					className="px-8 lg:px-16"
				>
					<Button
						as="label"
						htmlFor="image"
						bgColor={colors.primary}
						color={colors.white}
						variant="solid"
						width={"200px"}
						_hover={{ bg: "#0057FF" }}
						marginBottom={"50px"}
					>
						Change Image
						<input
							type="file"
							id="image"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: "none" }}
						/>
					</Button>
					<FormControl>
						<FormLabel
							color={colors.primary}
							fontSize={"28px"}
							fontWeight={600}
						>
							Description
						</FormLabel>
						<Input
							type="text"
							name="description"
							value={formData.description}
							color={colors.secondaryText}
							onChange={handleInputChange}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Generic Name
						</FormLabel>
						<Input
							type="text"
							name="generic_name"
							value={formData.generic_name}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Content
						</FormLabel>
						<Input
							type="text"
							name="content"
							value={formData.content}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Product Form
						</FormLabel>
						<Input
							type="text"
							name="productForm"
							value={formData.product_form}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Product Classification
						</FormLabel>
						<Input
							type="text"
							name="productClassification"
							value={formData.product_classification}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Packaging
						</FormLabel>
						<Input
							type="text"
							name="packaging"
							value={formData.unit_in_pack}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Manufacture
						</FormLabel>
						<Input
							type="text"
							name="manufacture"
							value={formData.manufacturer}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Weight
						</FormLabel>
						<Input
							type="text"
							name="weight"
							value={formData.weight}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Width
						</FormLabel>
						<Input
							type="text"
							name="width"
							value={formData.width}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Height
						</FormLabel>
						<Input
							type="text"
							name="height"
							value={formData.height}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
					<FormControl>
						<FormLabel
							fontWeight={600}
							fontSize={"18px"}
							color={colors.primaryText}
						>
							Length
						</FormLabel>
						<Input
							type="text"
							name="length"
							value={formData.length}
							onChange={handleInputChange}
							color={colors.secondaryText}
						/>
					</FormControl>
				</Stack>
				<Flex width={"100vw"} justifyContent={"center"} marginBottom={"50px"}>
					<Button
						mt={4}
						type="submit"
						colorScheme="blue"
						textAlign={"center"}
						isDisabled={
							formData.name === "" ||
							formData.generic_name === "" ||
							formData.image === "" ||
							formData.description === "" ||
							formData.content === "" ||
							formData.product_form === "" ||
							formData.product_classification === "" ||
							formData.unit_in_pack === "" ||
							formData.manufacturer === "" ||
							formData.weight === 0 ||
							formData.width === 0 ||
							formData.height === 0 ||
							formData.length === 0
						}
					>
						Save Changes
					</Button>
				</Flex>
			</form>
		</>
	);
};

interface AddProductProps {
	productRedirect: string;
}

export default Page;
