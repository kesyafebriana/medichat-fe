import * as yup from "yup";

export const createPharmacySchema = yup.object({
	name: yup.string().required("please fill name field"),
	address: yup.string().required("please fill address field"),
	lat: yup.number().required(),
	lng: yup.number().required(),
	pharmacist_name: yup.string().required("please fill pharmacist name"),
	pharmacist_license: yup.string().required("please fill pharmacist license"),
	pharmacist_phone: yup.string().required("please fill pharmacist phone"),
});
export type CreatePharmacyFields = yup.InferType<typeof createPharmacySchema>;

export const updatePharmacySchema = yup.object({
	name: yup.string().required("please fill name field"),
	address: yup.string().required("please fill address field"),
	lat: yup.number().required(),
	lng: yup.number().required(),
	pharmacist_name: yup.string().required("please fill pharmacist name"),
	pharmacist_license: yup.string().required("please fill pharmacist license"),
	pharmacist_phone: yup.string().required("please fill pharmacist phone"),
});
export type UpdatePharmacyFields = yup.InferType<typeof updatePharmacySchema>;

export const updatePharmacyOperation = yup.object({
	pharmacy_operations: yup
		.array()
		.of(
			yup.object().shape({
				day: yup.string().required("please fill day field"),
				start_time: yup.string().required("please fill start time"),
				end_time: yup.string().required("please fill end time"),
			})
		)
		.compact((v) => !v.checked)
		.min(1, "you must be choose pharmacy operations"),
});
export type UpdatePharmacyOperationsFields = yup.InferType<
	typeof updatePharmacyOperation
>;

export const updateShipmentMethodSchema = yup.object({
	pharmacy_shipment_method: yup
		.array()
		.of(
			yup.object().shape({
				slug: yup.string().required("please fill day field"),
				pharmacy_id: yup.number().required("please fill start time"),
				shipment_method_id: yup.number().required("please fill end time"),
			})
		)
		.compact((v) => !v.checked)
		.min(1, "you must be choose shipment method"),
});
export type UpdateShipmentMethodFields = yup.InferType<
	typeof updateShipmentMethodSchema
>;
