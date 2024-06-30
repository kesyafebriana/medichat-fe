import { HttpStatus } from "@/constants/api";
import { BadRequest } from "@/exceptions/badRequest";
import { InternalServerError } from "@/exceptions/internalServerError";
import { NotFound } from "@/exceptions/notFound";
import { ResponseError } from "@/exceptions/responseError";
import { Chat, CloseChat, SendDoctorNotes } from "@/types/requests/chats";
import { APIResponse } from "@/types/responses";
import { Product, ProductPaginatedResponse } from "@/types/responses/product";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";
import dayjs from "dayjs";

export const postChatText = async (
  roomId: string,
  onFinish: () => void,
  message: string,
  userId: string,
  userName: string
): Promise<void> => {
  const formData = new FormData();

  const now = dayjs();

  console.log(now.utcOffset());

  const nowString = now.format("YYYY-MM-DDTHH:mm:ssZ");

  formData.append("message", message);
  formData.append("type", "text");
  formData.append("createdAt", nowString);

  formData.append("userId", userId);
  formData.append("userName", userName);

  try {
    const res = await apiService.post(`chat/send?roomId=${roomId}`, {
      body: formData,
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      switch (e.response.status) {
        case HttpStatus.NotFound:
          throw new NotFound(e.message);
        case HttpStatus.BadRequest:
          throw new BadRequest(e.message);
        default:
          throw new InternalServerError(e.message);
      }
    }
    throw e;
  }

  onFinish();
};

export const postPrescription = async (
  roomId: string,
  onFinish: () => void,
  token: string,

  chosenProduct: { product: Product; amount: number; direction: string }[]
): Promise<void> => {
  let drugs = chosenProduct.map((val, i) => {
    return {
      product_id: val.product.id,
      count: val.amount,
      direction: val.direction,
    };
  });

  const data = {
    drugs: drugs,
  };

  console.log(JSON.stringify(data));

  try {
    const res = await apiService.post(`chat/prescribe?roomId=${roomId}`, {
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      switch (e.response.status) {
        case HttpStatus.NotFound:
          throw new NotFound(e.message);
        case HttpStatus.BadRequest:
          throw new BadRequest(e.message);
        default:
          throw new InternalServerError(e.message);
      }
    }
    throw e;
  }

  onFinish();
};

export const postChatImage = async (
  roomId: string,
  onFinish: () => void,
  file: FileList,
  userId: string,
  userName: string
): Promise<void> => {
  const formData = new FormData();

  const now = dayjs();

  const nowString = now.format("YYYY-MM-DDTHH:mm:ssZ");

  formData.append("file", file[0]);
  formData.append("type", "files");
  formData.append("createdAt", nowString);

  formData.append("userId", userId);
  formData.append("userName", userName);

  try {
    const res = await apiService.post(`chat/send?roomId=${roomId}`, {
      body: formData,
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      switch (e.response.status) {
        case HttpStatus.NotFound:
          throw new NotFound(e.message);
        case HttpStatus.BadRequest:
          throw new BadRequest(e.message);
        default:
          throw new InternalServerError(e.message);
      }
    }
    throw e;
  }

  onFinish();
};

export const startChat = async (
  payload: Chat,
  token: string
): Promise<APIResponse<null> | undefined> => {
  try {
    const formData = new FormData();
    formData.append("doctorId", payload.doctor_id.toString());
    const res = await apiService.post<APIResponse<null>>("chat/create", {
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

export const endChat = async (
  payload: CloseChat,
  token: string
): Promise<APIResponse<null> | undefined> => {
  try {
    const res = await apiService.patch<APIResponse<null>>(
      `chat/close?roomId=${payload.room_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};

export const sendDoctorNotes = async (
  payload: SendDoctorNotes,
  token: string
): Promise<APIResponse<null> | undefined> => {
  try {
    const formData = new FormData();
    formData.append("user_id", payload.user_id.toString());
    formData.append("room_id", payload.room_id.toString());
    formData.append("message", payload.message);
    const res = await apiService.post<APIResponse<null>>(`chat/note`, {
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
