import React from "react";
import {
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
import { useFormik } from "formik";
import { RegisterFields, registerSchema } from "@/types/validator/auth";
import { FormState, defaultFormState } from "@/types/form";
import { getVerifyToken, register } from "@/services/auth";
import FormError from "./FormError";
import { BadRequest } from "@/exceptions/badRequest";

const RegisterForm = ({ role }: RegisterFormProps) => {
	const toast = useToast();
	const [emailRegistered, setEmailRegistered] = React.useState<string>("");
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onRegister = async (values: RegisterFields) => {
		try {
			setFormState((prev) => ({
				...prev,
				errorMessage: "",
				isLoading: true,
			}));
			await register({
				role,
				email: values.email,
			});
			setEmailRegistered(values.email);
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
			return;
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}

		try {
			await getVerifyToken({
				email: values.email,
			});
			formik.resetForm();
			toast({
				title: "Email registered.",
				description: "Please check your email for verify account",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			toast({
				title: "Server encounter error.",
				description: "failed to sent email verification",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const formik = useFormik<RegisterFields>({
		initialValues: {
			email: "",
		},
		validationSchema: registerSchema,
		onSubmit: onRegister,
		validateOnChange: false,
	});

	const onReGetVerifyToken = async () => {
		try {
			await getVerifyToken({
				email: emailRegistered,
			});
			toast({
				title: "Email verification was sent.",
				description: "Please check your email for verify account",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			toast({
				title: "Server encounter error.",
				description: "failed to sent email verification",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

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
					isDisabled={emailRegistered !== ""}
					isLoading={formState.isLoading}
					variant={"brandPrimary"}
					color={"white"}
					size={"lg"}
					type="submit"
				>
					Send Email Verification
				</Button>
				{emailRegistered && (
					<Flex className="text-sm text-gray-400" columnGap={1}>
						<Text>verification email was not sent?</Text>
						<Text
							as={"u"}
							className="hover:cursor-pointer"
							onClick={onReGetVerifyToken}
						>
							send again.
						</Text>
					</Flex>
				)}
			</Stack>
		</form>
	);
};

interface RegisterFormProps {
	role: string;
}

export default RegisterForm;
