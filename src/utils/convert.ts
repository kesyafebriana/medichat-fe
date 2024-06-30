export function convertToSlug(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export const toRupiah = (value: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	})
		.format(value)
		.slice(0, -3);
};

export function convertToRupiah(num: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(num);
}
