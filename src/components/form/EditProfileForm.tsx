import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, FormEvent } from "react";
import { useFormik } from "formik";
import {
  UpdateProfileFields,
  updateProfileSchema,
} from "@/types/validator/profile";
import { FormState, defaultFormState } from "@/types/form";
import { InternalServerError } from "@/exceptions/internalServerError";
import { serverEncounterError } from "@/constants/error";
import FormError from "./FormError";
import { updateUserProfile } from "@/services/profile";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { updateProfile } from "@/redux/slice/profileSlice";
import useSession from "@/hooks/useSession";
import { colors } from "@/constants/colors";

const EditProfileForm = ({ closeModal }: EditProfileFormProps) => {
	const { session } = useSession();
	const toast = useToast();
	const dispatch = useAppDispatch();
	const profileState = useAppSelector((state) => state.profile);
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const avatarRef = React.useRef(null);
	const [input, setInput] = React.useState<FileList>();

	const onUpdateProfile = async (values: UpdateProfileFields) => {
		try {
			setFormState((prev) => ({ ...prev, isLoading: true }));
			await updateUserProfile(
				{
					name: values.name,
					date_of_birth: values.date_of_birth,
					photo: values.image,
				},
				session?.access_token ?? ""
			);
			dispatch(
				updateProfile({
					name: values.name,
					date_of_birth: values.date_of_birth,
					photo_url: values.image ? URL.createObjectURL(values.image as File) : profileState.photo_url,
				})
			);
			closeModal();
			toast({
				title: "profile updated.",
				description: "successfully update profile.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e: any) {
			if (e instanceof InternalServerError) {
				setFormState((prev) => ({
					...prev,
					errorMessage: serverEncounterError,
				}));
			}
			setFormState((prev) => ({ ...prev, errorMessage: e.message }));
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

  const formik = useFormik<UpdateProfileFields>({
    initialValues: {
      name: profileState.name,
      date_of_birth: profileState.date_of_birth,
      image: undefined,
    },
    validationSchema: updateProfileSchema,
    onSubmit: onUpdateProfile,
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

	const imageSrc = formik.values.image
		? URL.createObjectURL(formik.values.image as File)
		: profileState.photo_url;

	const onSelectImageFile = () => {
		if (inputFileRef.current) {
			inputFileRef.current.click();
			if (
				inputFileRef.current.files !== null &&
				inputFileRef.current.files !== undefined &&
				inputFileRef.current.files.length > 0
			) {
				formik.setFieldValue("image", inputFileRef.current.files[0]);
				setInput(inputFileRef.current.files)
			}
		}
	};

	const onImageChange = (ev: ChangeEvent<HTMLInputElement>) => {
		if ((ev.target.files?.length ?? 0) > 0) {
			formik.setFieldValue("image", ev.target.files![0]);
		} else {
			formik.setFieldValue("image", null);
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
							ref={avatarRef}
							className="hover:cursor-pointer"
							onClick={() => onSelectImageFile()}
						/>
						<Input type="file" className="hidden" ref={inputFileRef} accept="image/png" onChange={onImageChange}/>
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
				{profileState.role === "user" && (
					<FormControl isInvalid={formik.errors.date_of_birth ? true : false}>
						<FormLabel>Date Of Birth</FormLabel>
						<Input
							id="date_of_birth"
							name="date_of_birth"
							value={formik.values.date_of_birth}
							onChange={onChange}
							size={"lg"}
							type="date"
						/>
						<FormErrorMessage>{formik.errors.date_of_birth}</FormErrorMessage>
					</FormControl>
				)}
			</Flex>
			<Stack>
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
					Edit Profile
				</Button>
			</Stack>
		</form>
	);
};

interface EditProfileFormProps {
  closeModal: () => void;
}

export default EditProfileForm;
