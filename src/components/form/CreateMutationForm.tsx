import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import useSession from "@/hooks/useSession";
import { stockTransfer } from "@/services/stock";
import {
	CreateStockTransferFields,
	createStockTransferSchema,
} from "@/types/validator/stock";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
	useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import { SingleValue } from "chakra-react-select";
import PharmacyPicker from "../ui/PharmacyPicker";
import StockPicker from "../ui/StockPicker";

const CreateMutationForm = ({
	closeModal,
	mutate,
}: CreateMutationFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const { formState, onLoading, onFinished, onFailed, onResetError } =
		useFormState();
	const [selectedProductStock, setSelectedProductStock] =
		React.useState<number>();

	const onCreateMutation = async (values: CreateStockTransferFields) => {
		try {
			onLoading();
			await stockTransfer(values, session?.access_token ?? "");
			toast({
				title: "Stock transfer request",
				description: "Successfully create stock transfer request",
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

	const formik = useFormik<CreateStockTransferFields>({
		initialValues: {
			source_pharmacy_slug: "",
			target_pharmacy_slug: "",
			product_slug: "",
			amount: 0,
		},
		validateOnChange: false,
		validationSchema: createStockTransferSchema,
		onSubmit: onCreateMutation,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onResetError();
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	const onChooseProduct = (newValue: SingleValue<string>) => {
		const v = newValue as unknown as {
			value: string;
			label: string;
			meta: {
				stock: number;
			};
		};
		setSelectedProductStock(v.meta.stock);
		formik.setFieldValue("product_slug", v.value);
	};

	const onChooseSourcePharmacy = (newValue: SingleValue<string>) => {
		const v = newValue as unknown as { value: string; label: string };
		formik.setFieldValue("source_pharmacy_slug", v.value);
	};

	const onChooseTargetPharmacy = (newValue: SingleValue<string>) => {
		const v = newValue as unknown as { value: string; label: string };
		formik.setFieldValue("target_pharmacy_slug", v.value);
	};

	return (
		<form className="flex flex-col gap-y-4 pb-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<FormControl
					isInvalid={formik.errors.source_pharmacy_slug ? true : false}
				>
					<FormLabel>Source pharmacy</FormLabel>
					<PharmacyPicker
						onChange={onChooseSourcePharmacy}
						placeholder="Choose source pharmacy"
					/>
					<FormErrorMessage>
						{formik.errors.source_pharmacy_slug}
					</FormErrorMessage>
				</FormControl>
				<FormControl
					isInvalid={formik.errors.target_pharmacy_slug ? true : false}
				>
					<FormLabel>Target pharmacy</FormLabel>
					<PharmacyPicker
						onChange={onChooseTargetPharmacy}
						placeholder="Choose target pharmacy"
					/>
					<FormErrorMessage>
						{formik.errors.target_pharmacy_slug}
					</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.product_slug ? true : false}>
					<FormLabel>Product</FormLabel>
					<StockPicker
						onChange={onChooseProduct}
						source_pharmacy_slug={formik.values.source_pharmacy_slug}
						target_pharmacy_slug={formik.values.target_pharmacy_slug}
					/>
					{selectedProductStock && (
						<FormHelperText>Stock: {selectedProductStock}</FormHelperText>
					)}
					<FormErrorMessage>{formik.errors.product_slug}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.amount ? true : false}>
					<FormLabel>Amount</FormLabel>
					<Input
						id="amount"
						name="amount"
						type="number"
						value={formik.values.amount}
						size={"lg"}
						onChange={onChange}
					/>
					<FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
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

interface CreateMutationFormProps {
	closeModal: () => void;
	mutate: () => void;
}

export default CreateMutationForm;
