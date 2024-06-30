import { CategoryWithParentName, defaultCategoryWithParentName } from "./category";

export interface Product {
	id: number;
	category_id: number;
	product_detail_id: number;
	category_name?: string;
	name: string;
	slug: string;
	photo_url: string;
}

export interface ProductPaginatedResponse {
	products: Product[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}

export interface ProductListQuery {
	page?: number;
	limit?: number;
	term?: string;
	long?: number;
	lat?: number;
	sort_by?: string;
	sort_type?: string;
}

export const toProductListQueryString = (query: ProductListQuery): string => {
	const urlParams = new URLSearchParams();
	if (query.page) urlParams.set("page", "" + query.page);
	if (query.limit) urlParams.set("limit", "" + query.limit);
	if (query.term) urlParams.set("term", "" + query.term);
	if (query.long) urlParams.set("long", "" + query.long);
	if (query.lat) urlParams.set("lat", "" + query.lat);
	if (query.sort_by) urlParams.set("sort_by", "" + query.sort_by);
	if (query.sort_type) urlParams.set("sort_type", "" + query.sort_type);
	return urlParams.toString();
};

export const defaultProduct: Product = {
	id: 0,
	category_id: 0,
	product_detail_id: 0,
	name: "",
	slug: "",
	photo_url: "",
}

export interface ProductDetails {
	id: number;
	generic_name: string;
	content: string;
	composition: string;
	manufacturer: string;
	description: string;
	product_classification: string;
	product_form: string;
	unit_in_pack: string;
	selling_unit: string;
	weight: number;
	height: number;
	length: number;
	width: number; 
}

export const defaultProductDetails: ProductDetails = {
	id: 0,
	generic_name: "",
	content: "",
	composition: "",
	manufacturer: "",
	description: "",
	product_classification: "",
	product_form: "",
	unit_in_pack: "",
	selling_unit: "",
	weight: 0,
	height: 0,
	length: 0,
	width: 0,
}

export interface ProductWithDetails extends Product {
	product_detail: ProductDetails;
	category: CategoryWithParentName;
}

export const defaultProductWithDetails: ProductWithDetails = {
	...defaultProduct,
	product_detail: defaultProductDetails,
	category: defaultCategoryWithParentName,
}