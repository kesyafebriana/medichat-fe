import { colors } from "@/constants/colors";
import { NotFound } from "@/exceptions/notFound";
import { Unauthorized } from "@/exceptions/unauthorized";
import { FormState, defaultFormState } from "@/types/form";
import { LoginFields, loginSchema } from "@/types/validator/auth";
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Link,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React from "react";
import FormError from "./FormError";
import { useRouter } from "next/router";
import { loginSession } from "@/services/sessions";
import { role } from "@/constants/role";
import { pages } from "@/constants/pages";

const LoginForm = () => {
	const router = useRouter();
	const [formState, setFormState] = React.useState<FormState>({
		...defaultFormState,
	});

	const onLogin = async (values: LoginFields) => {
		try {
			setFormState((prev) => ({
				...prev,
				errorMessage: "",
				isLoading: true,
			}));
			const res = await loginSession(values);
			if (res) {
				if (
					!res.profile_set &&
					[role.DOCTOR, role.USER].includes(res.role)
				) {
					router.push(pages.SET_PROFILE);
					return;
				}
				switch (res.role) {
					case role.ADMIN:
						router.push(`${process.env.NEXT_PUBLIC_LOGIN_ADMIN_REDIRECT}`);
						break;
					case role.PHARMACY_MANAGER:
						router.push(`${process.env.NEXT_PUBLIC_LOGIN_PHARMACY_REDIRECT}`);
						break;
					case role.USER:
						router.push(`${process.env.NEXT_PUBLIC_LOGIN_USER_REDIRECT}`);
						break;
					case role.DOCTOR:
						router.push(`${process.env.NEXT_PUBLIC_LOGIN_DOCTOR_REDIRECT}`);
						break;
					default:
						router.push(`${process.env.NEXT_PUBLIC_LOGIN_DEFAULT_REDIRECT}`);
				}
			}
		} catch (e) {
			if (e instanceof NotFound || e instanceof Unauthorized) {
				setFormState((prev) => ({
					...prev,
					errorMessage: "invalid email or password.",
				}));
			} else {
				setFormState((prev) => ({
					...prev,
					errorMessage: "server encounter error.",
				}));
			}
		} finally {
			setFormState((prev) => ({
				...prev,
				isLoading: false,
			}));
		}
	};

	const formik = useFormik<LoginFields>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: loginSchema,
		onSubmit: onLogin,
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
			<Flex direction={"column"} rowGap={2}>
				<Flex direction={"column"} rowGap={6}>
					<FormControl isInvalid={formik.errors.email ? true : false}>
						<FormLabel>Enter your username or email address</FormLabel>
						<Input
							id="email"
							name="email"
							value={formik.values.email}
							onChange={onChange}
							size={"lg"}
						/>
						<FormErrorMessage>{formik.errors.email}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={formik.errors.password ? true : false}>
						<FormLabel>Enter your Password</FormLabel>
						<Input
							id="password"
							name="password"
							type="password"
							value={formik.values.password}
							onChange={onChange}
							size={"lg"}
						/>
						<FormErrorMessage>{formik.errors.password}</FormErrorMessage>
					</FormControl>
				</Flex>
				{formState.errorMessage !== "" ? (
					<FormError>{formState.errorMessage}</FormError>
				) : null}
			</Flex>
			<Link
				color={colors.primary}
				fontWeight={"semibold"}
				fontSize={11}
				className="self-end"
				href="/forgot-password"
			>
				Forgot Password
			</Link>
			<Button
				isLoading={formState.isLoading}
				variant={"brandPrimary"}
				color={"white"}
				size={"lg"}
				type="submit"
			>
				Sign In
			</Button>
		</form>
	);
};

export default LoginForm;
