import React from "react";
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
import {
	ForgotPasswordFields,
	forgotPassworsSchema,
} from "@/types/validator/auth";
import { FormState, defaultFormState } from "@/types/form";
import FormError from "./FormError";
import { BadRequest } from "@/exceptions/badRequest";
import { forgetPassword } from "@/services/auth";

const ForgotPasswordForm = () => {
	const toast = useToast();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onSendResetPasswordToken = async (values: ForgotPasswordFields) => {
		try {
			setFormState((prev) => ({
				...prev,
				errorMessage: "",
				isLoading: true,
			}));
			await forgetPassword(values);
			formik.resetForm();
			toast({
				title: "email was sent.",
				description: "Please check your email for reset your password",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			if (e instanceof BadRequest) {
				const message = e.message;
				setFormState((prev) => ({
					...prev,
					errorMessage: message,
				}));
				return;
			}
			setFormState((prev) => ({
				...prev,
				errorMessage: "server encounter error.",
			}));
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const formik = useFormik<ForgotPasswordFields>({
		initialValues: {
			email: "",
		},
		validationSchema: forgotPassworsSchema,
		onSubmit: onSendResetPasswordToken,
		validateOnChange: false,
	});

	return (
		<form className="flex flex-col gap-y-8" onSubmit={formik.handleSubmit}>
			<Flex direction={"column"} rowGap={2}>
				<Flex direction={"column"} rowGap={6}>
					<FormControl isInvalid={formik.errors.email ? true : false}>
						<FormLabel>Enter email address</FormLabel>
						<Input
							id="email"
							name="email"
							value={formik.values.email}
							onChange={(e) => {
								setFormState((prev) => ({ ...prev, errorMessage: "" }));
								formik.setErrors({ ...formik.errors, [e.target.id]: "" });
								formik.handleChange(e);
							}}
							size={"lg"}
						/>
						<FormErrorMessage>{formik.errors.email}</FormErrorMessage>
					</FormControl>
				</Flex>
				{formState.errorMessage !== "" && (
					<FormError>{formState.errorMessage}</FormError>
				)}
			</Flex>
			<Stack>
				<Button
					isLoading={formState.isLoading}
					variant={"brandPrimary"}
					color={"white"}
					size={"lg"}
					type="submit"
				>
					Send Email Verification
				</Button>
			</Stack>
		</form>
	);
};

export default ForgotPasswordForm;
