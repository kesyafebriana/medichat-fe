import { colors } from "@/constants/colors";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
} from "@chakra-ui/react";
import React from "react";
import LocationPicker from "../ui/LocationPicker";
import { useFormik } from "formik";
import {
	CreateUserProfileFields,
	createUserProfileSchema,
} from "@/types/validator/profile";
import { FormState, defaultFormState } from "@/types/form";
import { useAppDispatch } from "@/redux/reduxHook";
import { createUserProfile } from "@/services/profile";
import { useRouter } from "next/router";
import { pages } from "@/constants/pages";
import { serverEncounterError } from "@/constants/error";
import { InternalServerError } from "@/exceptions/internalServerError";
import FormError from "./FormError";
import { updateProfile } from "@/redux/slice/profileSlice";
import { AccountProfile } from "@/types/responses/profile";
import { SessionData } from "@/utils/session";
import { updateSession } from "@/services/sessions";
import { role } from "@/constants/role";

const SetUserProfileForm = ({
	session,
	accountProfile,
}: SetUserProfileFormProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const onCreateUserProfile = async (values: CreateUserProfileFields) => {
		try {
			setFormState((prev) => ({ ...prev, isLoading: true }));
			await createUserProfile(
				{
					account_id: accountProfile.id,
					name: values.name,
					date_of_birth: values.date_of_birth,
					alias: values.alias,
					address: values.address,
					lat: values.lat,
					lng: values.lng,
					image: undefined,
				},
				session.access_token
			);
			await updateSession({ ...session, profile_set: true });
			dispatch(
				updateProfile({
					profile_set: true,
					name: values.name,
					date_of_birth: values.date_of_birth,
				})
			);
			if (session.role === role.DOCTOR) {
				router.replace(
					process.env.NEXT_PUBLIC_LOGIN_DOCTOR_REDIRECT ?? pages.HOME
				);
			}
			router.replace(process.env.NEXT_PUBLIC_LOGIN_USER_REDIRECT ?? pages.HOME);
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

	const formik = useFormik<CreateUserProfileFields>({
		initialValues: {
			name: accountProfile.name,
			date_of_birth: "",
			alias: "",
			address: "",
			lat: -6.230878,
			lng: 106.8242218,
		},
		validationSchema: createUserProfileSchema,
		onSubmit: onCreateUserProfile,
		validateOnChange: false,
	});
	const [isOpenMap, setIsOpenMap] = React.useState<boolean>(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormState((prev) => ({
			...prev,
			errorMessage: "",
		}));
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	return (
		<form className="flex flex-col gap-y-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<Text fontWeight={600} fontSize={"20px"}>
					Personal Data
				</Text>
				<FormControl isInvalid={formik.errors.name ? true : false}>
					<FormLabel>Name</FormLabel>
					<Input
						id="name"
						name="name"
						value={formik.values.name}
						onChange={onChange}
						size={"lg"}
						type="text"
					/>
					<FormErrorMessage>{formik.errors.name}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={formik.errors.date_of_birth ? true : false}>
					<FormLabel>Date of Birth</FormLabel>
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
				<div>
					<Text fontWeight={600} fontSize={"20px"}>
						Address Data
					</Text>
					<Text fontWeight={500} fontSize={"14px"} color={colors.secondaryText}>
						You can change or add more address after your account set up has
						been done.
					</Text>
				</div>

				<FormControl isInvalid={formik.errors.alias ? true : false}>
					<FormLabel>Alias</FormLabel>
					<Input
						id="alias"
						name="alias"
						value={formik.values.alias}
						size={"lg"}
						type="text"
						onChange={onChange}
					/>
					<FormErrorMessage>{formik.errors.alias}</FormErrorMessage>
				</FormControl>
				<FormControl>
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

interface SetUserProfileFormProps {
	session: SessionData;
	accountProfile: AccountProfile;
}

export default SetUserProfileForm;
