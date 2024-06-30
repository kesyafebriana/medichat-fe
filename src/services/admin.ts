import { ResponseError } from "@/exceptions/responseError";
import { AddCategoryRequest, AddCategoryRequestLevel1, AddProductRequest } from "@/types/requests/admin";
import { APIResponse } from "@/types/responses";
import {
  CategoriesListResponse,
  CategoriesResponse,
  DetailProductResponse,
  Payments,
  PaymentsData,
} from "@/types/responses/admin";

import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getCategories = async (
  token: string,
  page?: number,
  limit?: number,
  sortBy?: string,
  sortType?: "ASC" | "DESC",
  term?: string,
  parentSlug?: string,
  level?: number
): Promise<CategoriesListResponse | undefined> => {
  try {
    const params: { [key: string]: any } = {};

    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (sortBy !== undefined) params.sort_by = sortBy;
    if (sortType !== undefined) params.sort_type = sortType;
    if (term !== undefined) params.term = term;
    if (parentSlug !== undefined) params.parent_slug = parentSlug;
    if (level !== undefined) params.level = level;

    const queryString = new URLSearchParams(params).toString();

    const res = await apiService.get<CategoriesListResponse>(
      `categories?${queryString}`,
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

export const getCategoriesBySlug = async (
  token: string,
  slug: string
): Promise<CategoriesResponse | undefined> => {
  try {
    const res = await apiService.get<CategoriesResponse>(`categories/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};

export const deleteCategoriesBySlug = async (
  slug: string,
  token: string
): Promise<CategoriesResponse | undefined> => {
  try {
    const res = await apiService.delete<CategoriesResponse[]>(
      `categories/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res) {
      return res.find((item) => item.data?.slug === slug);
    }
  } catch (e) {
    throw await wrapError(e);
  }
};

export const editCategoryBySlug = async (
  token: string,
  payload: AddCategoryRequestLevel1,
  slug: string | string[] | undefined
): Promise<CategoriesResponse | undefined> => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("image", payload.image);    

    const res = await apiService.patch<CategoriesResponse>(
      `categories/${slug}`,
      {
        body: formData,
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

export const addCategory = async (
  token: string,
  payload: AddCategoryRequest
): Promise<CategoriesResponse | undefined> => {
  try {
    const res = await apiService.post<CategoriesResponse>(`categories`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};

export const addCategoryLevel2 = async (
  token: string,
  payload: AddCategoryRequest,
  slug: string
): Promise<CategoriesResponse | undefined> => {
  try {
    const res = await apiService.post<CategoriesResponse>(
      `categories/${slug}`,
      {
        body: JSON.stringify(payload),
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

export const addProduct = async (
  token: string,
  payload: AddProductRequest
): Promise<DetailProductResponse | undefined> => {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("generic_name", payload.generic_name);
    formData.append("category_id", payload.category_id.toString());
    formData.append("composition", payload.composition);
    formData.append("content", payload.content);
    formData.append("description", payload.description);
    formData.append("height", payload.height.toString());
    formData.append("length", payload.length.toString());
    formData.append("width", payload.width.toString());
    formData.append("weight", payload.weight.toString());
    formData.append("manufacturer", payload.manufacturer);
    formData.append("product_classification", payload.product_classification);
    formData.append("product_form", payload.product_form);
    formData.append("selling_unit", payload.selling_unit);
    formData.append("unit_in_pack", payload.unit_in_pack);
    if (payload.picture) {
      formData.append("picture", payload.picture);
    }
    console.log(formData);

    const res = await apiService.post<DetailProductResponse>("product", {
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

export const editProduct = async (
  token: string,
  payload: AddProductRequest,
  slug: string | string[] | undefined
): Promise<DetailProductResponse | undefined> => {
  try {
    const formData = new FormData();
    formData.append("slug", slug as string);
    formData.append("name", payload.name);
    formData.append("generic_name", payload.generic_name);
    formData.append("category_id", payload.category_id.toString());
    formData.append("composition", payload.composition);
    formData.append("content", payload.content);
    formData.append("description", payload.description);
    formData.append("height", payload.height.toString());
    formData.append("length", payload.length.toString());
    formData.append("width", payload.width.toString());
    formData.append("weight", payload.weight.toString());
    formData.append("manufacturer", payload.manufacturer);
    formData.append("product_classification", payload.product_classification);
    formData.append("product_form", payload.product_form);
    formData.append("selling_unit", payload.selling_unit);
    formData.append("unit_in_pack", payload.unit_in_pack);
    if (payload.picture) {
      formData.append("picture", payload.picture);
    }

    const res = await apiService.patch<DetailProductResponse>(`product/${slug}`, {
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    if (e instanceof ResponseError) {
      console.log("error");
    }
    throw e;
  }
};

export const getOrders = async (
  token: string,
  page?: number,
  limit?: number,
  is_confirmed?: string,
): Promise<APIResponse<PaymentsData> | undefined> => {
  try {
    const params: { [key: string]: any } = {};

    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (is_confirmed !== undefined) params.is_confirmed = is_confirmed;

    const queryingString = new URLSearchParams(params).toString()

    return await apiService.get<APIResponse<PaymentsData>>(`payments?${queryingString}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (e) {
    throw await wrapError(e);
  }
};

export const getOrdersByInvoice = async (
  id: string,
  token: string,
): Promise<APIResponse<Payments> | undefined> => {
  try {
    return await apiService.get<APIResponse<Payments>>(`payments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (e) {
    throw await wrapError(e);
  }
};

export const confirmOrder = async (
  invoice: string,
  token: string,
): Promise<APIResponse<null> | undefined> => {
  try {
    return await apiService.post<APIResponse<null>>(`payments/${invoice}/confirm`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
  } catch (e) {
    throw await wrapError(e);
  }
}
