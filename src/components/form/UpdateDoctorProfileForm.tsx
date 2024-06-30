import { colors } from "@/constants/colors";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { updateDoctorProfileAction } from "@/redux/slice/doctorProfileSlice";
import { FormState, defaultFormState } from "@/types/form";
import {
	UpdateDoctorProfileFields,
	updateDoctorProfileSchema,
} from "@/types/validator/profile";
import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputGroup,
	InputLeftAddon,
	Radio,
	RadioGroup,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";

const UpdateDoctorProfileForm = ({
	closeModal,
}: UpdateDoctorProfileFormProps) => {
	const doctorProfileState = useAppSelector((state) => state.doctorProfile);
	const { session } = useSession();
	const dispatch = useAppDispatch();
	const toast = useToast();
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const onUpdateDoctorProfile = async (values: UpdateDoctorProfileFields) => {
		try {
			setFormState((prev) => ({ ...prev, errorMessage: "", isLoading: true }));
			await dispatch(
				updateDoctorProfileAction({
					token: session?.access_token ?? "",
					payload: {
						name: values.name,
						work_location: values.work_location,
						gender: values.gender,
						phone_number: values.phone_number,
						price: values.price,
						photo: values.photo,
					},
				})
			).unwrap();
			closeModal();
			toast({
				title: "profile updated.",
				description: " successfully update profile",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			setFormState((prev) => ({
				...prev,
				errorMessage: "failed updating profile. Try again later.",
				isLoading: true,
			}));
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const formik = useFormik<UpdateDoctorProfileFields>({
		initialValues: {
			name: doctorProfileState.name,
			gender: doctorProfileState.gender,
			work_location: doctorProfileState.work_location,
			phone_number: doctorProfileState.phone_number,
			price: doctorProfileState.price,
			photo: undefined,
		},
		onSubmit: onUpdateDoctorProfile,
		validationSchema: updateDoctorProfileSchema,
		validateOnChange: false,
	});

	const imageSrc = formik.values.photo
		? URL.createObjectURL(formik.values.photo as File)
		: doctorProfileState.photo_url;

	const onSelectImageFile = () => {
		if (inputFileRef.current) {
			inputFileRef.current.click();
			if (
				inputFileRef.current.files !== null &&
				inputFileRef.current.files !== undefined &&
				inputFileRef.current.files.length > 0
			) {
				formik.setFieldValue("photo", inputFileRef.current.files[0]);
			}
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormState((prev) => ({
			...prev,
			errorMessage: "",
		}));
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	const onImageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		if ((ev.target.files?.length ?? 0) > 0) {
			formik.setFieldValue("photo", ev.target.files![0]);
		} else {
			formik.setFieldValue("photo", null);
		}
	}

	return (
		<form className="flex flex-col gap-y-8 py-6" onSubmit={formik.handleSubmit}>
			<Flex justifyContent={"center"}>
				<Box className="relative">
					<Box>
						<Avatar
							width={"100px"}
							height={"100px"}
							src={imageSrc}
							className="hover:cursor-pointer"
							onClick={() => onSelectImageFile()}
						/>
						<Input
							type="file"
							className="hidden"
							ref={inputFileRef}
							accept="image/png"
							onChange={onImageChange}
						/>
					</Box>
					<Flex
						width={"30px"}
						height={"30px"}
						borderRadius={"100%"}
						bg={colors.primary}
						className="absolute bottom-0 right-0"
						cursor={"pointer"}
						alignItems={"center"}
						justifyContent={"center"}
					>
						<Text
							color={colors.white}
							fontSize={"14px"}
							onClick={() => onSelectImageFile()}
						>
							<i className="fa-solid fa-pen"></i>
						</Text>
					</Flex>
				</Box>
			</Flex>
			<Flex direction={"column"} rowGap={6}>
				<FormControl isInvalid={formik.errors.name ? true : false}>
					<FormLabel>Fullname</FormLabel>
					<Input
						id="name"
						name="name"
						value={formik.values.name}
						onChange={onChange}
						size={"lg"}
					/>
					<FormErrorMessage>{formik.errors.name}</FormErrorMessage>
				</FormControl>
				<FormControl
					width={"fit-content"}
					isInvalid={formik.errors.gender ? true : false}
				>
					<FormLabel>Gender</FormLabel>
					<RadioGroup
						value={formik.values.gender}
						onChange={(value) => {
							formik.setFieldValue("gender", value);
							formik.setErrors({ ...formik.errors, gender: "" });
						}}
					>
						<Stack direction="row">
							<Radio value="male">Male</Radio>
							<Radio value="female">Female</Radio>
						</Stack>
					</RadioGroup>
					<FormErrorMessage>{formik.values.gender}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.work_location ? true : false}>
					<FormLabel>Work location</FormLabel>
					<Input
						id="work_location"
						name="work_location"
						value={formik.values.work_location}
						onChange={onChange}
						size={"lg"}
						type="text"
					/>
					<FormErrorMessage>{formik.errors.work_location}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.phone_number ? true : false}>
					<FormLabel>Phone number</FormLabel>
					<Input
						id="phone_number"
						name="phone_number"
						value={formik.values.phone_number}
						onChange={onChange}
						size={"lg"}
						type="number"
					/>
					<FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.price ? true : false}>
					<FormLabel>Price</FormLabel>
					<InputGroup size={"lg"}>
						<InputLeftAddon>Rp</InputLeftAddon>
						<Input
							id="price"
							name="price"
							size={"lg"}
							type="number"
							value={formik.values.price}
							onChange={onChange}
						/>
					</InputGroup>
					<FormErrorMessage>{formik.errors.price}</FormErrorMessage>
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
				Save
			</Button>
		</form>
	);
};

interface UpdateDoctorProfileFormProps {
	closeModal: () => void;
}

export default UpdateDoctorProfileForm;
