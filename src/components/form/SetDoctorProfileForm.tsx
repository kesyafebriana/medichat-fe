import { serverEncounterError } from "@/constants/error";
import { pages } from "@/constants/pages";
import { InternalServerError } from "@/exceptions/internalServerError";
import { createDoctorProfile } from "@/services/profile";
import { FormState, defaultFormState } from "@/types/form";
import { AccountProfile } from "@/types/responses/profile";
import {
	CreateDoctorProfileFields,
	createDoctorProfileSchema,
} from "@/types/validator/profile";
import {
	Flex,
	Text,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Select,
	RadioGroup,
	Radio,
	Stack,
	InputGroup,
	InputLeftAddon,
	Button,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import FormError from "./FormError";
import { Specialization } from "@/types/requests/profile";
import { updateSession } from "@/services/sessions";
import { SessionData } from "@/utils/session";

const SetDoctorProfileForm = ({
	session,
	accountProfile,
	specializations,
}: SetDoctorProfileFormProps) => {
	const certificateInputRef = React.useRef<HTMLInputElement>(null);
	const router = useRouter();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const onCreateDoctorProfile = async (values: CreateDoctorProfileFields) => {
		try {
			setFormState((prev) => ({ ...prev, errorMessage: "", isLoading: true }));
			await createDoctorProfile(
				{
					name: values.name,
					str: values.str,
					specialization_id: +values.specialization_id,
					work_location: values.work_location,
					gender: values.gender,
					phone_number: `${values.phone_number}`,
					is_active: true,
					start_work_date: values.start_work_date,
					year_experience: values.year_experience,
					price: values.price,
					certificate: values.certificate,
					photo: undefined,
				},
				session.access_token
			);
			await updateSession({ ...session, profile_set: true });
			router.push(pages.HOME);
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
	const formik = useFormik<CreateDoctorProfileFields>({
		initialValues: {
			name: accountProfile.name,
			gender: "",
			specialization_id: "",
			str: "",
			work_location: "",
			phone_number: "",
			start_work_date: "",
			year_experience: 0,
			price: 0,
			certificate: "",
		},
		validationSchema: createDoctorProfileSchema,
		onSubmit: onCreateDoctorProfile,
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
		<form className="flex flex-col gap-y-4" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={6}>
				<Text fontWeight={600} fontSize={"20px"}>
					Personal Data
				</Text>
			</Flex>
			<FormControl isInvalid={formik.errors.name ? true : false}>
				<FormLabel>Name</FormLabel>
				<Input
					id="name"
					name="name"
					size={"lg"}
					type="text"
					value={formik.values.name}
					onChange={onChange}
				/>
				<FormErrorMessage>{formik.errors.name}</FormErrorMessage>
			</FormControl>
			<Flex columnGap={10} direction={"row"}>
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
				<FormControl isInvalid={formik.errors.specialization_id ? true : false}>
					<FormLabel>Specialization</FormLabel>
					<Select
						placeholder="Select option"
						value={formik.values.specialization_id}
						onChange={(e) => {
							formik.setFieldValue("specialization_id", e.currentTarget.value);
							formik.setErrors({ ...formik.errors, specialization_id: "" });
						}}
					>
						{specializations.map((s) => (
							<option key={s.id} value={s.id}>
								{s.name}
							</option>
						))}
					</Select>
					<FormErrorMessage>{formik.errors.specialization_id}</FormErrorMessage>
				</FormControl>
			</Flex>
			<FormControl isInvalid={formik.errors.str ? true : false}>
				<FormLabel>STR</FormLabel>
				<Input
					id="str"
					name="str"
					size={"lg"}
					type="text"
					value={formik.values.str}
					onChange={onChange}
				/>
				<FormErrorMessage>{formik.errors.str}</FormErrorMessage>
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
			<Flex columnGap={4}>
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
				<FormControl isInvalid={formik.errors.start_work_date ? true : false}>
					<FormLabel>Start work date</FormLabel>
					<Input
						id="start_work_date"
						name="start_work_date"
						size={"lg"}
						type="date"
						value={formik.values.start_work_date}
						onChange={onChange}
					/>
					<FormErrorMessage>{formik.errors.start_work_date}</FormErrorMessage>
				</FormControl>
			</Flex>
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
			<FormControl
				width={"fit-content"}
				isInvalid={formik.errors.certificate ? true : false}
			>
				<FormLabel>Certificate</FormLabel>
				<Input
					id="certification"
					name="certification"
					size={"lg"}
					type="file"
					border={0}
					width={"fit-content"}
					accept="application/pdf"
					ref={certificateInputRef}
					onChange={() => {
						if (certificateInputRef.current) {
							if (
								certificateInputRef.current.files !== null &&
								certificateInputRef.current.files !== undefined &&
								certificateInputRef.current.files.length > 0
							) {
								formik.setFieldValue(
									"certificate",
									certificateInputRef.current.files[0]
								);
								formik.setErrors({ ...formik.errors, certificate: "" });
							}
						}
					}}
				/>
				<FormErrorMessage>
					Please check your certificate input field
				</FormErrorMessage>
			</FormControl>
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

interface SetDoctorProfileFormProps {
	session: SessionData;
	accountProfile: AccountProfile;
	specializations: Specialization[];
}

export default SetDoctorProfileForm;
