import { PageInfo } from ".";

export interface StockResponse {
	id: number;
	pharmacy_id: number;
	product_id: number;
	stock: number;
	price: number;
}

export interface StockJoined {
	id: number;
	product: {
		id: number;
		slug: string;
		name: string;
	};
	pharmacy: {
		id: number;
		slug: string;
		name: string;
	};
	stock: number;
	price: number;
}

export interface PaginatedStockJoined {
	page_info: PageInfo;
	stocks: StockJoined[];
}

export interface Stock {
	id: number;
	product_id: number;
	pharmacy_id: number;
	stock: number;
	price: number;
}

export interface StockMutation {
	id: number;
	source_id: number;
	target_id: number;
	method: string;
	status: string;
	amount: number;
	created_at: string;
}

export interface StockMutationJoined {
	id: number;
	source: {
		id: number;
		pharmacy_id: number;
		pharmacy_slug: string;
		pharmacy_name: string;
	};
	target: {
		id: number;
		pharmacy_id: number;
		pharmacy_slug: string;
		pharmacy_name: string;
	};
	product: {
		id: number;
		slug: string;
		name: string;
	};
	method: string;
	status: string;
	amount: number;
	created_at: string;
}

export interface PaginatedStockMutationJoined {
	page_info: PageInfo;
	stock_mutations: StockMutationJoined[];
}

export interface StockResponse {
	id: number;
	pharmacy_id: number;
	product_id: number;
	stock: number;
	price: number;
}

export interface StockMutation {
	id: number;
	source_id: number;
	target_id: number;
	method: string;
	status: string;
	amount: number;
	created_at: string;
}

export interface StockMutationJoined {
	id: number;
	source: {
		id: number;
		pharmacy_id: number;
		pharmacy_slug: string;
		pharmacy_name: string;
	};
	product: {
		id: number;
		slug: string;
		name: string;
	};
	method: string;
	status: string;
	amount: number;
	created_at: string;
}

export interface PaginatedStockMutationJoined {
	page_info: PageInfo;
	stock_mutations: StockMutationJoined[];
}
