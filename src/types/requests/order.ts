import { OrderStatus } from "@/constants/order";

export interface OrderRequest {
	pharmacy_slug: string;
	shipment_method_id: number;
	address: string;
	coordinate: {
	  lon: number;
	  lat: number;
	};
	items: {
	  product_slug: string;
	  amount: number;
	}[];
  }
  
  export interface OrdersRequest {
	orders: OrderRequest[];
  }
  
export interface OrderQuery {
	pharmacy_slug?: string;
	status?: string;
	page?: number;
	limit?: number;
}

export const toOrderQueryString = (query: OrderQuery) => {
	const urlParams = new URLSearchParams();
	if (query.pharmacy_slug) urlParams.set("pharmacy_slug", query.pharmacy_slug);
	if (query.status) urlParams.set("status", query.status);
	if (query.page) urlParams.set("page", `${query.page}`);
	if (query.limit) urlParams.set("limit", `${query.limit}`);
	return urlParams.toString();
};

export const isValidOrderStatus = (value?: string): boolean => {
	if (!value) return false;
	return [
		OrderStatus.Canceled,
		OrderStatus.Finished,
		OrderStatus.Processing,
		OrderStatus.Sent,
		OrderStatus.WaitingConfirmation,
		OrderStatus.WaitingPayment,
	].includes(value);
};
