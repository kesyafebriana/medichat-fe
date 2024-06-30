import * as yup from "yup";

export const updateStockSchema = yup.object({
	id: yup.number().required("please choose stock"),
	stock: yup
		.number()
		.required("please fill stock field")
		.min(0, "stock must be greater than 0"),
	price: yup
		.number()
		.required("please fill price field")
		.min(0, "price must be greater than 0"),
});
export type UpdateStockFields = yup.InferType<typeof updateStockSchema>;

export const createStockSchema = yup.object({
	product_slug: yup.string().required("please choose product"),
	pharmacy_slug: yup.string().required("please choose pharmacy"),
	stock: yup
		.number()
		.required("please fill stock field")
		.min(0, "stock must be greater than 0"),
	price: yup
		.number()
		.required("please fill price field")
		.min(0, "price must be greater than 0"),
});
export type CreateStockFields = yup.InferType<typeof createStockSchema>;

export const createStockTransferSchema = yup.object({
	source_pharmacy_slug: yup.string().required("please choose source pharmacy"),
	target_pharmacy_slug: yup
		.string()
		.required("please choose target pharmacy")
		.notOneOf(
			[yup.ref("source_pharmacy_slug")],
			"target pharmacy must be different from source pharmacy"
		),
	product_slug: yup.string().required("please choose product"),
	amount: yup
		.number()
		.required("please fill amount field")
		.min(1, "amount must be greater than or equal 1"),
});
export type CreateStockTransferFields = yup.InferType<
	typeof createStockTransferSchema
>;
