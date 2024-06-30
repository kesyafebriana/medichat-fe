import { APIResponse } from "@/types/responses";
import {
	ProductListQuery,
	ProductPaginatedResponse,
	toProductListQueryString,
	ProductWithDetails,
} from "@/types/responses/product";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getProducts = async (
	query: ProductListQuery
): Promise<APIResponse<ProductPaginatedResponse> | undefined> => {
	try {
		const queryString = toProductListQueryString(query);
		return apiService.get<APIResponse<ProductPaginatedResponse>>(
			`product/list?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getProductBySlug = async (
	slug: string,
	token: string
): Promise<APIResponse<ProductWithDetails> | undefined> => {
	try {
		const res = await apiService.get<APIResponse<ProductWithDetails>>(
			`product/${slug}`,
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
}

export const deleteProductBySlug = async (
	slug: string,
	token: string,
): Promise <APIResponse<ProductWithDetails> | undefined> => {
	try {
		const res = await apiService.delete<APIResponse<ProductWithDetails>>(
			`product/${slug}`,
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
}