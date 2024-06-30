import { verifyAccount } from "@/services/auth";
import { FormState, defaultFormState } from "@/types/form";
import {
	AccountVerificationFields,
	accountVerificationSchema,
} from "@/types/validator/auth";
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
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import { useRouter } from "next/router";

const VerificationForm = ({ email, token, isValid }: VerificationFormProps) => {
	const router = useRouter();
	const toast = useToast();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onVerify = async (values: AccountVerificationFields) => {
		try {
			setFormState((prev) => ({ ...prev, errorMessage: "", isLoading: true }));
			await verifyAccount({
				email,
				verify_email_token: token,
				password: values.password,
			});
			toast({
				title: "Account Verification",
				description:
					"successfully verify your account. redirect to login page...",
				isClosable: false,
				status: "success",
				duration: 3000,
				position: "top-right",
				onCloseComplete: () => router.push("/login"),
			});
			formik.resetForm();
		} catch (e) {
			setFormState((prev) => ({
				...prev,
				errorMessage: "server encounter error.",
			}));
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const formik = useFormik<AccountVerificationFields>({
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		onSubmit: onVerify,
		validationSchema: accountVerificationSchema,
		validateOnChange: false,
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (formState.errorMessage) {
			setFormState((prev) => ({ ...prev, errorMessage: "" }));
		}
		formik.setErrors({ ...formik.errors, [e.target.id]: "" });
		formik.handleChange(e);
	};

	return (
		<form className="flex flex-col gap-y-4" onSubmit={formik.handleSubmit}>
			<Stack>
				<Flex direction={"column"} rowGap={6}>
					<FormControl isInvalid={formik.errors.password ? true : false}>
						<FormLabel>Set password</FormLabel>
						<Input
							id="password"
							name="password"
							value={formik.values.password}
							onChange={onChange}
							size={"lg"}
							type="password"
						/>
						<FormErrorMessage>{formik.errors.password}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formik.errors.confirmPassword ? true : false}>
						<FormLabel>Confirm password</FormLabel>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							value={formik.values.confirmPassword}
							onChange={onChange}
							size={"lg"}
							type="password"
						/>
						<FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
					</FormControl>
				</Flex>
				{formState.errorMessage && (
					<FormError>{formState.errorMessage}</FormError>
				)}
			</Stack>
			<Button
				isDisabled={!isValid}
				isLoading={formState.isLoading}
				variant={"brandPrimary"}
				color={"white"}
				size={"lg"}
				type="submit"
			>
				Verify
			</Button>
		</form>
	);
};

interface VerificationFormProps {
	email: string;
	token: string;
	isValid: boolean;
}

export default VerificationForm;
