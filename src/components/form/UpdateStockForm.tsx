import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import useSession from "@/hooks/useSession";
import { updateStock } from "@/services/stock";
import { StockJoinedRowData } from "@/types/table/stock";
import { UpdateStockFields, updateStockSchema } from "@/types/validator/stock";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";

const UpdateStockForm = ({
	closeModal,
	stock,
	mutate,
}: UpdateStockFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const { onFailed, onFinished, onLoading, formState, onResetError } =
		useFormState();
	const onUpdateStock = async (values: UpdateStockFields) => {
		try {
			onLoading();
			await updateStock(values, session?.access_token ?? "");
			toast({
				title: "Update stock",
				description: "Successfully update stock",
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

	const formik = useFormik<UpdateStockFields>({
		initialValues: {
			id: stock.id,
			stock: stock.stock,
			price: stock.price,
		},
		validationSchema: updateStockSchema,
		validateOnChange: false,
		onSubmit: onUpdateStock,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onResetError();
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	return (
		<form className="flex flex-col gap-y-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<FormControl>
					<FormLabel>Pharmacy</FormLabel>
					<Input value={stock.pharmacy_name} isReadOnly size={"lg"} />
					<FormHelperText fontSize={10}>*Read only</FormHelperText>
				</FormControl>
				<FormControl>
					<FormLabel>Product name</FormLabel>
					<Input value={stock.product_name} isReadOnly size={"lg"} />
					<FormHelperText fontSize={10}>*Read only</FormHelperText>
				</FormControl>
				<FormControl isInvalid={formik.errors.price ? true : false}>
					<FormLabel>Price</FormLabel>
					<InputGroup size={"lg"}>
						<InputLeftAddon>Rp</InputLeftAddon>
						<Input
							id="price"
							name="price"
							type="number"
							value={formik.values.price}
							size={"lg"}
							onChange={onChange}
						/>
					</InputGroup>
					<FormErrorMessage>{formik.errors.price}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.stock ? true : false}>
					<FormLabel>Stock</FormLabel>
					<Input
						id="stock"
						name="stock"
						value={formik.values.stock}
						size={"lg"}
						onChange={onChange}
						type="number"
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
				Update
			</Button>
		</form>
	);
};

interface UpdateStockFormProps {
	closeModal: () => void;
	stock: StockJoinedRowData;
	mutate: () => void;
}

export default UpdateStockForm;
