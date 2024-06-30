import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import useSession from "@/hooks/useSession";
import {
	CreatePharmacyFields,
	createPharmacySchema,
} from "@/types/validator/pharmacies";
import {
	Button,
	Checkbox,
	CheckboxGroup,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import { createPharmacy } from "@/services/pharmacies";
import LocationPicker from "../ui/LocationPicker";

const CreatePharmacyForm = ({
	closeModal,
	mutate,
}: CreatePharmacyFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const { formState, onFailed, onFinished, onLoading, onResetError } =
		useFormState();
	const [operations, setOperations] = React.useState<string[]>([]);
	const [shipmentMethods, setShipmentMethods] = React.useState<string[]>([]);

	const onCreatePharmacy = async (values: CreatePharmacyFields) => {
		try {
			onLoading();
			const operationsReq = operations.map((o) => ({
				day: o,
				start_time: "08:00",
				end_time: "17:00",
			}));
			const shipmentMethodReq = shipmentMethods.map((s) => ({
				shipment_method_id: +s,
			}));
			await createPharmacy(
				{
					name: values.name,
					address: values.address,
					coordinate: {
						lat: values.lat,
						lon: values.lng,
					},
					pharmacist_name: values.pharmacist_name,
					pharmacist_license: values.pharmacist_license,
					pharmacist_phone: `${values.pharmacist_phone}`,
					pharmacy_operations: operationsReq,
					pharmacy_shipment_methods: shipmentMethodReq,
				},
				session?.access_token ?? ""
			);
			toast({
				title: "Create pharmacy",
				description: "Successfully create pharmacy",
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

	const formik = useFormik<CreatePharmacyFields>({
		initialValues: {
			name: "",
			address: "",
			lat: -6.230878,
			lng: 106.8242218,
			pharmacist_name: "",
			pharmacist_license: "",
			pharmacist_phone: "",
		},
		validateOnChange: false,
		validationSchema: createPharmacySchema,
		onSubmit: onCreatePharmacy,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onResetError();
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	const onChangeOperations = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (operations.includes(e.currentTarget.value)) {
			setOperations((prev) => [
				...prev.filter((o) => o !== e.currentTarget.value),
			]);
			return;
		}
		setOperations((prev) => [...prev, e.currentTarget.value]);
	};

	const onChangeShipmentMethods = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (shipmentMethods.includes(e.currentTarget.value)) {
			setShipmentMethods((prev) => [
				...prev.filter((o) => o !== e.currentTarget.value),
			]);
			return;
		}
		setShipmentMethods((prev) => [...prev, e.currentTarget.value]);
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
				<Flex direction={"column"} rowGap={4}>
					<Text>Operations:</Text>
					<CheckboxGroup value={operations}>
						<Grid templateColumns="repeat(3, 1fr)" gap={2}>
							<GridItem>
								<Checkbox value={"Monday"} onChange={onChangeOperations}>
									Monday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Tuesday"} onChange={onChangeOperations}>
									Tuesday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Wednesday"} onChange={onChangeOperations}>
									Wednesday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Thursday"} onChange={onChangeOperations}>
									Thursday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Friday"} onChange={onChangeOperations}>
									Friday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Saturday"} onChange={onChangeOperations}>
									Saturday
								</Checkbox>
							</GridItem>
							<GridItem>
								<Checkbox value={"Sunday"} onChange={onChangeOperations}>
									Sunday
								</Checkbox>
							</GridItem>
						</Grid>
					</CheckboxGroup>
				</Flex>
				<Flex direction={"column"} rowGap={4}>
					<Text>Shipment Method:</Text>
					<CheckboxGroup value={shipmentMethods}>
						<Checkbox value={"1"} onChange={onChangeShipmentMethods}>
							Official Instant
						</Checkbox>
						<Checkbox value={"2"} onChange={onChangeShipmentMethods}>
							Official Same Day
						</Checkbox>
						<Checkbox value={"3"} onChange={onChangeShipmentMethods}>
							JNE
						</Checkbox>
					</CheckboxGroup>
				</Flex>
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

interface CreatePharmacyFormProps {
	closeModal: () => void;
	mutate: () => void;
}

export default CreatePharmacyForm;
