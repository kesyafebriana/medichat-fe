import { OrderQuery, OrderRequest, toOrderQueryString } from "@/types/requests/order";
import { APIResponse } from "@/types/responses";
import { Order, OrdersResponse, PaginatedOrder } from "@/types/responses/order";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";
import { OrdersRequest } from "@/types/requests/order";
import { OrderResponse } from "@/types/responses/order";

export const getOrders = async (
	token: string,
	query?: OrderQuery
): Promise<APIResponse<PaginatedOrder> | undefined> => {
	try {
		const queryString = query ? toOrderQueryString(query) : "";
		return apiService.get<APIResponse<PaginatedOrder>>(
			`orders?${queryString}`,
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

export const getOrderById = async (
	idOrder: number,
	token: string
): Promise<APIResponse<Order> | undefined> => {
	try {
		return apiService.get<APIResponse<Order>>(`orders/${idOrder}`, {
			headers:{
				Authorization: `Bearer ${token}`,
				"Content-Type":"application/json"
			}
		})
	}catch(e){
		throw await wrapError
	}
}

export const createOrder = async (
	payload: OrdersRequest,
	token: string
): Promise<APIResponse<OrdersResponse> | undefined> => {
	try {
		return await apiService.post<APIResponse<OrdersResponse>>("orders", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const sendOrder = async (
	idOrder: number,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		return await apiService.post<APIResponse<null>>(`orders/${idOrder}/send`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const finishOrder = async (
	idOrder: number | string,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		return await apiService.post<APIResponse<null>>(`orders/${idOrder}/finish`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
	}catch(e) {
		throw await wrapError(e)
	}
}


export const cancelOrder = async (
	idOrder: number | string,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		return await apiService.post<APIResponse<null>>(`orders/${idOrder}/cancel`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getOrderByID = async (
	id: string,
	token: string
): Promise<APIResponse<OrderResponse> | undefined> => {
	try {
		return await apiService.get<APIResponse<OrderResponse>>(`orders/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};
