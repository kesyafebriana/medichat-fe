import React from "react";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	Tag,
	Text,
	useToast,
} from "@chakra-ui/react";
import FormError from "./FormError";
import { useFormik } from "formik";
import {
	UpdateUserLocationFields,
	updateUserLocationSchema,
} from "@/types/validator/profile";
import { FormState, defaultFormState } from "@/types/form";
import LocationPicker from "../ui/LocationPicker";
import { UserLocation } from "@/types/responses/profile";
import { useAppDispatch } from "@/redux/reduxHook";
import { updateAddressAction } from "@/redux/slice/locationSlice";
import useSession from "@/hooks/useSession";

const UpdateUserLocationForm = ({
	isMainLocation,
	location,
	closeModal,
}: UpdateUserLocationFormProps) => {
	const dispatch = useAppDispatch();
	const { session } = useSession();
	const toast = useToast();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const [isOpenMap, setIsOpenMap] = React.useState<boolean>(false);
	const onUpdateUserLocation = async (values: UpdateUserLocationFields) => {
		try {
			setFormState((prev) => ({ ...prev, isLoading: true }));
			await dispatch(
				updateAddressAction({
					token: session?.access_token ?? "",
					payload: {
						id: location.id,
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
				title: "address updated.",
				description: "successfully update address.",
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

	const formik = useFormik<UpdateUserLocationFields>({
		initialValues: {
			alias: location.alias,
			address: location.address,
			lat: location.coordinate.lat,
			lng: location.coordinate.lon,
		},
		validationSchema: updateUserLocationSchema,
		onSubmit: onUpdateUserLocation,
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
		<form className="pb-6" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				{isMainLocation && (
					<Tag width={"fit-content"} colorScheme="green">
						Main Location
					</Tag>
				)}
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
							<Text>Address</Text>
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
						Update
					</Button>
				</Stack>
			</Flex>
		</form>
	);
};

interface UpdateUserLocationFormProps {
	location: UserLocation;
	isMainLocation: boolean;
	closeModal: () => void;
}

export default UpdateUserLocationForm;
