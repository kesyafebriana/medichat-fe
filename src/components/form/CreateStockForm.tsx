import { useFormState } from "@/hooks/useFormState";
import { CreateStockFields, createStockSchema } from "@/types/validator/stock";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import { addStock } from "@/services/stock";
import useSession from "@/hooks/useSession";
import { serverEncounterError } from "@/constants/error";
import ProductPicker from "../ui/ProductPicker";
import { SingleValue } from "chakra-react-select";
import PharmacyPicker from "../ui/PharmacyPicker";

const CreateStockForm = ({ closeModal, mutate }: CreateStockFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const { formState, onResetError, onLoading, onFailed, onFinished } =
		useFormState();

	const onCreateStock = async (values: CreateStockFields) => {
		try {
			onLoading();
			await addStock(values, session?.access_token ?? "");
			toast({
				title: "Create stock",
				description: "Successfully create stock",
				isClosable: true,
				duration: 3000,
				position: "top-right",
				status: "success",
			});
			mutate();
			closeModal();
		} catch (e) {
			onFailed(serverEncounterError);
		} finally {
			onFinished();
		}
	};

	const formik = useFormik<CreateStockFields>({
		initialValues: {
			product_slug: "",
			pharmacy_slug: "",
			price: 0,
			stock: 0,
		},
		validationSchema: createStockSchema,
		validateOnChange: false,
		onSubmit: onCreateStock,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onResetError();
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	const onChooseProduct = (newValue: SingleValue<string>) => {
		const v = newValue as unknown as { value: string; label: string };
		formik.setFieldValue("product_slug", v.value);
	};

	const onChoosePharmacy = (newValue: SingleValue<string>) => {
		const v = newValue as unknown as { value: string; label: string };
		formik.setFieldValue("pharmacy_slug", v.value);
	};

	return (
		<form className="flex flex-col gap-y-4 py-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<FormControl isInvalid={formik.errors.pharmacy_slug ? true : false}>
					<FormLabel>Pharmacy</FormLabel>
					<PharmacyPicker onChange={onChoosePharmacy} />
					<FormErrorMessage>{formik.errors.pharmacy_slug}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.product_slug ? true : false}>
					<FormLabel>Product</FormLabel>
					<ProductPicker onChange={onChooseProduct} />
					<FormErrorMessage>{formik.errors.product_slug}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.price ? true : false}>
					<FormLabel>Price</FormLabel>
					<Input
						id="price"
						name="price"
						type="number"
						value={formik.values.price}
						size={"lg"}
						onChange={onChange}
					/>
					<FormErrorMessage>{formik.errors.price}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.stock ? true : false}>
					<FormLabel>Stock</FormLabel>
					<Input
						id="stock"
						name="stock"
						type="number"
						value={formik.values.stock}
						size={"lg"}
						onChange={onChange}
					/>
					<FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
				</FormControl>
			</Flex>
			{formState.errorMessage !== "" && (
				<FormError>{formState.errorMessage}</FormError>
			)}
			<Button
				isLoading={formState.isLoading}
				variant={"brandPrimary"}
				color={"white"}
				size={"lg"}
				type="submit"
			>
				Create
			</Button>
		</form>
	);
};

interface CreateStockFormProps {
	closeModal: () => void;
	mutate: () => void;
}

export default CreateStockForm;
