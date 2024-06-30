import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import FormError from "./FormError";
import { FormState, defaultFormState } from "@/types/form";
import LocationPicker from "../ui/LocationPicker";
import { useFormik } from "formik";
import {
	CreateUserLocationFields,
	createUserLocationSchema,
} from "@/types/validator/profile";
import { useAppDispatch } from "@/redux/reduxHook";
import { addAddressAction } from "@/redux/slice/locationSlice";
import useSession from "@/hooks/useSession";

const CreateUserLocationForm = ({
	closeModal,
}: CreateUserLocationFormProps) => {
	const toast = useToast();
	const dispatch = useAppDispatch();
	const { session } = useSession();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const [isOpenMap, setIsOpenMap] = React.useState<boolean>(false);

	const onCreateUserLocation = async (values: CreateUserLocationFields) => {
		try {
			setFormState((prev) => ({ ...prev, isLoading: true }));
			await dispatch(
				addAddressAction({
					token: session?.access_token ?? "",
					payload: {
						alias: values.alias,
						address: values.address,
						coordinate: {
							lat: values.lat,
							lon: values.lng,
						},
						is_active: true,
					},
				})
			).unwrap();
			closeModal();
			toast({
				title: "address added.",
				description: "successfully added address.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e: any) {
			setFormState((prev) => ({ ...prev, errorMessage: e.meta.message }));
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const formik = useFormik<CreateUserLocationFields>({
		initialValues: {
			alias: "",
			address: "",
			lat: -6.230878,
			lng: 106.8242218,
		},
		validationSchema: createUserLocationSchema,
		onSubmit: onCreateUserLocation,
		validateOnChange: false,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormState((prev) => ({
			...prev,
			errorMessage: "",
		}));
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	return (
		<form className="py-6" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<FormControl isInvalid={formik.errors.alias ? true : false}>
					<FormLabel>Alias</FormLabel>
					<Input
						id="alias"
						name="alias"
						onChange={onChange}
						value={formik.values.alias}
						size={"lg"}
						type="text"
					/>
					<FormErrorMessage>{formik.errors.alias}</FormErrorMessage>
				</FormControl>
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
						value={formik.values.address}
						isDisabled={true}
						placeholder="User address"
					/>
					<FormErrorMessage>{formik.errors.address}</FormErrorMessage>
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
				</FormControl>
				<Stack>
					{formState.errorMessage !== "" && (
						<FormError>{formState.errorMessage}</FormError>
					)}
					<Button
						variant={"brandPrimary"}
						type="submit"
						isLoading={formState.isLoading}
					>
						Add
					</Button>
				</Stack>
			</Flex>
		</form>
	);
};

interface CreateUserLocationFormProps {
	closeModal: () => void;
}

export default CreateUserLocationForm;
