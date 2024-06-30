import { FormState, defaultFormState } from "@/types/form";
import React from "react";

interface UseFormStateReturn {
	formState: FormState;
	onLoading: () => void;
	onFinished: () => void;
	onResetError: () => void;
	onFailed: (errorMessage: string) => void;
}

export const useFormState = (): UseFormStateReturn => {
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);

	const onLoading = () =>
		setFormState((prev) => ({ ...prev, errorMessage: "", isLoading: true }));

	const onFinished = () =>
		setFormState((prev) => ({ ...prev, isLoading: false }));

	const onFailed = (errorMessage: string) =>
		setFormState((prev) => ({ ...prev, errorMessage }));

	const onResetError = () =>
		setFormState((prev) => ({ ...prev, errorMessage: "" }));

	return {
		formState,
		onLoading,
		onFinished,
		onResetError,
		onFailed,
	};
};
