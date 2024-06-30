export interface FormState {
	isLoading: boolean;
	errorMessage: string;
	type: string;
}

export const defaultFormState: FormState = {
	isLoading: false,
	errorMessage: "",
	type: "",
};
