import { UploadPaymentRequest } from "@/types/requests/payment";
import { APIResponse } from "@/types/responses";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const uploadPayment = async (
  payload: UploadPaymentRequest,
  token: string
): Promise<APIResponse<null> | undefined> => {
  try {
    const formData = new FormData();
    formData.append("data", "{}");
    formData.append("file", payload.file);
    const res = await apiService.post<APIResponse<null>>(`payments/${payload.invoiceNumber}/upload`, {
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};
