import { differenceInYears, parse } from "date-fns";
import * as yup from "yup";

const isOlderThan18YearsOld = (value: string | undefined) => {
	if (
		differenceInYears(new Date(), parse(value!!, "yyyy-mm-dd", new Date())) >=
		18
	) {
		return true;
	}
	return false;
};

export const createUserProfileSchema = yup.object({
	name: yup.string().required("please fill name field"),
	date_of_birth: yup
		.string()
		.test(
			"age validation",
			"must older than 18 years old",
			isOlderThan18YearsOld
		)
		.required("please choose date of birth"),
	alias: yup.string().required("please fill alias field"),
	address: yup.string().required("please choose address field from map"),
	lat: yup.number().required(),
	lng: yup.number().required(),
	image: yup.mixed().optional(),
});
export type CreateUserProfileFields = yup.InferType<
	typeof createUserProfileSchema
>;

export const updateProfileSchema = yup.object({
	name: yup.string().required("please fill name field"),
	date_of_birth: yup
		.string()
		.test(
			"age validation",
			"must older than 18 years old",
			isOlderThan18YearsOld
		)
		.required("please choose date of birth"),
	image: yup.mixed().optional(),
});
export type UpdateProfileFields = yup.InferType<typeof updateProfileSchema>;

export const createUserLocationSchema = yup.object({
	alias: yup.string().required("please fill alias field"),
	address: yup.string().required("please choose address field from map"),
	lat: yup.number().required(),
	lng: yup.number().required(),
});
export type CreateUserLocationFields = yup.InferType<
	typeof createUserLocationSchema
>;

export const updateUserLocationSchema = yup.object({
	alias: yup.string().required("please fill alias field"),
	address: yup.string().required("please choose address field from map"),
	lat: yup.number().required(),
	lng: yup.number().required(),
});
export type UpdateUserLocationFields = yup.InferType<
	typeof updateUserLocationSchema
>;

export const createDoctorProfileSchema = yup.object({
	name: yup.string().required("please fill name field"),
	gender: yup.string().required("please choose gender"),
	specialization_id: yup.string().required("please choose specialization"),
	str: yup.string().required("please fill str field"),
	work_location: yup.string().required("please fill work location field"),
	phone_number: yup
		.string()
		.required("please fill phone number field")
		.min(10, "phone number must be greater than or equal 10 characters")
		.max(15, "phone number must be lower than or equal 15 characters"),
	start_work_date: yup.string().required("please fill start work date field"),
	price: yup
		.number()
		.required("please fill price field")
		.min(0, "price must be greater than or equal 0")
		.max(1000000, "price must be lower than or equal Rp10.000.000"),
	year_experience: yup
		.number()
		.required("please fill year experience field")
		.min(0, "year experience must be greater than or equal 0"),
	certificate: yup.mixed().required("please upload your certification"),
});
export type CreateDoctorProfileFields = yup.InferType<
	typeof createDoctorProfileSchema
>;

export const updateDoctorProfileSchema = yup.object({
	name: yup.string().required("please fill name field"),
	gender: yup.string().required("please choose gender"),
	work_location: yup.string().required("please fill work location field"),
	phone_number: yup
		.string()
		.required("please fill phone number field")
		.min(10, "phone number must be greater than or equal 10 characters")
		.max(15, "phone number must be greater than or equal 15 characters"),
	price: yup
		.number()
		.required("please fill price field")
		.min(0, "price must be greater than or equal 0")
		.max(1000000, "price must be lower than or equal Rp10.000.000"),
	photo: yup.mixed().optional(),
});
export type UpdateDoctorProfileFields = yup.InferType<
	typeof updateDoctorProfileSchema
>;
