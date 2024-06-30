import * as yup from "yup";

export const uploadPaymentSchema = yup.object({
  file: yup.mixed().required("please upload a file"),
});

export type UploadPaymentFields = yup.InferType<typeof uploadPaymentSchema>;
