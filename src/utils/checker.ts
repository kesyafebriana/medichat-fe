import { MutationMethod, MutationStatus } from "@/constants/mutation";

export const isValidSort = (val: string): boolean => {
	return val === "asc" || val === "desc";
};

export const isValidSortBy = (value: string, options: string[]) => {
	return options.includes(value);
};

export const isValidMutationStatus = (value: string): boolean => {
	return [
		MutationStatus.Approved,
		MutationStatus.Cancelled,
		MutationStatus.Pending,
	].includes(value);
};

export const isValidMutationMethod = (value: string): boolean => {
	return [MutationMethod.Automatic, MutationMethod.Manual].includes(value);
};
