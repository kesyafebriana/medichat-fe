export const capitalize = (val: string): string => {
	const trimmedVal = val.trim();
	if (trimmedVal.length === 0) return val;
	return `${trimmedVal[0].toUpperCase()}${trimmedVal.slice(1)}`;
};

export const capitalizeEachWord = (val: string): string => {
	return val
		.split(" ")
		.map((w) => capitalize(w))
		.join(" ");
};
