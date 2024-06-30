export interface CreateStockRequest {
	product_slug: string;
	pharmacy_slug: string;
	stock: number;
	price: number;
}

export interface UpdateStockRequest {
	id: number;
	stock: number;
	price: number;
}

export interface StockTransferRequest {
	source_pharmacy_slug: string;
	target_pharmacy_slug: string;
	product_slug: string;
	amount: number;
}

export interface StockListQuery {
	product_slug?: string;
	product_name?: string;
	pharmacy_slug?: string;
	sort_by?: string;
	sort?: string;
	page?: number;
	limit?: number;
}

export interface StockMutationListQuery {
	product_slug?: string;
	product_name?: string;
	source_pharmacy_slug?: string;
	target_pharmacy_slug?: string;
	method?: string;
	status?: string;
	sort_by?: string;
	sort?: string;
	page?: number;
	limit?: number;
}

export const toStockListQueryString = (query: StockListQuery): string => {
	const urlParams = new URLSearchParams();
	if (query.product_slug) urlParams.set("product_slug", query.product_slug);
	if (query.product_name) urlParams.set("product_name", query.product_name);
	if (query.pharmacy_slug) urlParams.set("pharmacy_slug", query.pharmacy_slug);
	if (query.sort_by) urlParams.set("sort_by", query.sort_by);
	if (query.sort) urlParams.set("sort", query.sort);
	if (query.page) urlParams.set("page", "" + query.page);
	if (query.limit) urlParams.set("limit", "" + query.limit);
	return urlParams.toString();
};

export const toStockMutationListQueryString = (
	query: StockMutationListQuery
): string => {
	const urlParams = new URLSearchParams();
	if (query.product_slug) urlParams.set("product_slug", query.product_slug);
	if (query.product_name) urlParams.set("product_name", query.product_name);
	if (query.source_pharmacy_slug)
		urlParams.set("source_pharmacy_slug", query.source_pharmacy_slug);
	if (query.target_pharmacy_slug)
		urlParams.set("target_pharmacy_slug", query.target_pharmacy_slug);
	if (query.method) urlParams.set("method", query.method);
	if (query.status) urlParams.set("status", query.status);
	if (query.sort_by) urlParams.set("sort_by", query.sort_by);
	if (query.sort) urlParams.set("sort", query.sort);
	if (query.page) urlParams.set("page", "" + query.page);
	if (query.limit) urlParams.set("limit", "" + query.limit);
	return urlParams.toString();
};
