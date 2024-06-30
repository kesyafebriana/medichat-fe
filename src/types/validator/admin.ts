import * as yup from "yup";

export const addProductSchema = yup.object({
  name: yup.string().required("please fill this field"),
  generic_name: yup.string().required("please fill this field"),
  composition: yup.string().required("please fill this field"),
  content: yup.string().required("please fill this field"),
  manufacturer: yup.string().required("please fill this field"),
  description: yup.string().required("please fill this field"),
  category_id: yup.number().required("please fill this field"),
  product_classification: yup.string().required("please fill this field"),
  product_form: yup.string().required("please fill this field"),
  unit_in_pack: yup.string().required("please fill this field"),
  selling_unit: yup.string().required("please fill this field"),
  picture: yup.mixed().required("please fill this field"),
  weight: yup.number().required("please fill this field"),
  width: yup.number().required("please fill this field"),
  height: yup.number().required("please fill this field"),
  length: yup.number().required("please fill this field"),
});

export const editCategorySchema = yup.object({
  name: yup.string().required("please fill this field"),
  image: yup.mixed().required("please fill this field"),
  // slug: yup.string().required("please fill this field"),
});

export const addCategorySchema = yup.object({
  name: yup.string().required("please fill this field"),
  // photo_url: yup.string().required("please fill this field"),
});

export const addPartnerSchema = yup.object({
  email: yup
		.string()
		.email("invalid email format")
		.required("please fill email field"),
});

export const addCategorySchemaLevel2 = yup.object({
  name: yup.string().required("please fill this field"),
});

export type AddProductFields = yup.InferType<typeof addProductSchema>;
export type EditCategoryFields = yup.InferType<typeof editCategorySchema>;
export type AddCategoryFields = yup.InferType<typeof addCategorySchema>;
export type AddCategoryFieldsLevel2 = yup.InferType<typeof addCategorySchemaLevel2>;
export type AddPartnerFields = yup.InferType<typeof addPartnerSchema>;
