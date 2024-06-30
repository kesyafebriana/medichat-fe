import {
	CreateStockRequest,
	StockListQuery,
	StockMutationListQuery,
	StockTransferRequest,
	UpdateStockRequest,
	toStockListQueryString,
	toStockMutationListQueryString,
} from "@/types/requests/stock";
import { APIResponse } from "@/types/responses";
import {
	PaginatedStockJoined,
	PaginatedStockMutationJoined,
	Stock,
	StockMutation,
} from "@/types/responses/stock";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getStocks = async (
	query: StockListQuery,
	token: string
): Promise<APIResponse<PaginatedStockJoined> | undefined> => {
	try {
		const queryString = toStockListQueryString(query);
		return await apiService.get<APIResponse<PaginatedStockJoined>>(
			`stocks?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getStockById = async (
	idStock: number,
	token: string
): Promise<APIResponse<Stock> | undefined> => {
	try {
		return await apiService.get<APIResponse<Stock>>(`stocks/${idStock}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const addStock = async (payload: CreateStockRequest, token: string) => {
	try {
		return await apiService.post<APIResponse<Stock>>("stocks", {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateStock = async (
	payload: UpdateStockRequest,
	token: string
) => {
	try {
		return await apiService.patch<APIResponse<Stock>>(`stocks`, {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const deleteStock = async (
	idStock: number,
	token: string
): Promise<null | undefined> => {
	try {
		return await apiService.delete<null | undefined>(`stocks/${idStock}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getMutations = async (
	query: StockMutationListQuery,
	token: string
): Promise<APIResponse<PaginatedStockMutationJoined> | undefined> => {
	try {
		const queryString = toStockMutationListQueryString(query);
		return apiService.get<
			APIResponse<PaginatedStockMutationJoined> | undefined
		>(`mutations?${queryString}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getMutationById = async (
	idMutation: number,
	token: string
): Promise<APIResponse<StockMutation> | undefined> => {
	try {
		return apiService.get<APIResponse<StockMutation>>(
			`stocks/mutations/${idMutation}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const stockTransfer = async (
	payload: StockTransferRequest,
	token: string
): Promise<APIResponse<StockMutation> | undefined> => {
	try {
		return apiService.post<APIResponse<StockMutation>>(`stocks/mutations`, {
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const approveStockTransfer = async (
	idMutation: number,
	token: string
): Promise<APIResponse<StockMutation> | undefined> => {
	try {
		return apiService.post<APIResponse<StockMutation>>(
			`stocks/mutations/${idMutation}/approve`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const cancelStockTransfer = async (
	idMutation: number,
	token: string
): Promise<APIResponse<StockMutation> | undefined> => {
	try {
		return apiService.post<APIResponse<StockMutation>>(
			`stocks/mutations/${idMutation}/cancel`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};
