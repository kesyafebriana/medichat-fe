import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import useSession from "@/hooks/useSession";
import { updatePharmacy } from "@/services/pharmacies";
import { PharmaciesRowData } from "@/types/table/pharmacy";
import {
	UpdatePharmacyFields,
	updatePharmacySchema,
} from "@/types/validator/pharmacies";
import {
	Flex,
	FormControl,
	FormLabel,
	useToast,
	Input,
	Button,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import LocationPicker from "../ui/LocationPicker";

const UpdatePharmacyForm = ({
	pharmacy,
	mutate,
	closeModal,
}: UpdatePharmacyFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const { formState, onFailed, onFinished, onLoading, onResetError } =
		useFormState();

	const onUpdatePharmacy = async (values: UpdatePharmacyFields) => {
		try {
			onLoading();
			await updatePharmacy(pharmacy.slug, session?.access_token ?? "", {
				name: values.name,
				address: values.address,
				coordinate: {
					lat: values.lat,
					lon: values.lng,
				},
				pharmacist_name: values.pharmacist_name,
				pharmacist_license: values.pharmacist_license,
				pharmacist_phone: `${values.pharmacist_phone}`,
			});
			toast({
				title: "Update pharmacy",
				description: "Successfully update pharmacy",
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

	const formik = useFormik<UpdatePharmacyFields>({
		initialValues: {
			name: pharmacy.name,
			address: pharmacy.address,
			lat: pharmacy.coordinate_lat,
			lng: pharmacy.coordinate_lon,
			pharmacist_name: pharmacy.pharmacist_name,
			pharmacist_license: pharmacy.pharmacist_license,
			pharmacist_phone: pharmacy.pharmacist_phone,
		},
		validateOnChange: false,
		validationSchema: updatePharmacySchema,
		onSubmit: onUpdatePharmacy,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onResetError();
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	const [isOpenMap, setIsOpenMap] = React.useState<boolean>(false);

	return (
		<form className="flex flex-col gap-y-4 pb-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<Flex columnGap={4}>
					<FormControl isInvalid={formik.errors.name ? true : false}>
						<FormLabel>Name</FormLabel>
						<Input
							id="name"
							name="name"
							value={formik.values.name}
							size={"lg"}
							onChange={onChange}
						/>
						<FormErrorMessage>{formik.errors.name}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formik.errors.pharmacist_name ? true : false}>
						<FormLabel>Pharmacist Name</FormLabel>
						<Input
							id="pharmacist_name"
							name="pharmacist_name"
							value={formik.values.pharmacist_name}
							size={"lg"}
							onChange={onChange}
						/>
						<FormErrorMessage>{formik.errors.pharmacist_name}</FormErrorMessage>
					</FormControl>
				</Flex>
				<Flex columnGap={4}>
					<FormControl
						isInvalid={formik.errors.pharmacist_license ? true : false}
					>
						<FormLabel>Pharmacist License</FormLabel>
						<Input
							id="pharmacist_license"
							name="pharmacist_license"
							value={formik.values.pharmacist_license}
							size={"lg"}
							onChange={onChange}
						/>
						<FormErrorMessage>
							{formik.errors.pharmacist_license}
						</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={formik.errors.pharmacist_phone ? true : false}
					>
						<FormLabel>Pharmacist Phone</FormLabel>
						<Input
							id="pharmacist_phone"
							name="pharmacist_phone"
                            type="number"
							value={formik.values.pharmacist_phone}
							size={"lg"}
							onChange={onChange}
						/>
						<FormErrorMessage>
							{formik.errors.pharmacist_phone}
						</FormErrorMessage>
					</FormControl>
				</Flex>
				<FormControl isInvalid={formik.errors.address ? true : false}>
					<FormLabel>
						<Flex justifyContent={"space-between"} alignItems={"center"}>
							Address
							{!isOpenMap && (
								<Button
									height={"40px"}
									variant={"brandPrimary"}
									onClick={() => setIsOpenMap(true)}
								>
									Open Map
								</Button>
							)}
						</Flex>
					</FormLabel>
					<Input
						size={"lg"}
						type="text"
						isDisabled={true}
						placeholder="User address"
						value={formik.values.address}
					/>
					<FormErrorMessage>{formik.errors.address}</FormErrorMessage>
				</FormControl>
				{isOpenMap && (
					<LocationPicker
						errors={formik.errors}
						setErrors={formik.setErrors}
						centerPos={{
							lat: formik.values.lat,
							lng: formik.values.lng,
						}}
						setFieldValue={formik.setFieldValue}
						setIsOpenMap={setIsOpenMap}
					/>
				)}
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

interface UpdatePharmacyFormProps {
	pharmacy: PharmaciesRowData;
	closeModal: () => void;
	mutate: () => void;
}

export default UpdatePharmacyForm;
