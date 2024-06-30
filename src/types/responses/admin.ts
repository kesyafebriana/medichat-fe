import { APIResponse } from "../responses/index";
import { Coordinate } from "./pharmacies";
import { CategoryWithParentName } from "./category";
import { ProductDetails } from "./product";

export interface AdminProduct {
  id: number;
  name: string;
  generic_name: string;
  content: string;
  manufacture: string;
}

export interface AdminProductPaginatedResponse {
	products: AdminProduct[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}

export interface AdminDetailProduct {
  id: number;
  name: string;
  image: string;
  description: string;
  generic_name: string;
  content: string;
  categoryLevel1: string;
  categoryLevel2: string;
  productForm: string;
  productClassification: string;
  packaging: string;
  manufacture: string;
  weight: number;
  width: number;
  height: number;
  length: number;
}

export interface AdminDetailProductPaginatedResponse {
	products: AdminDetailProduct[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}

export interface Categories {
  id: number;
  name: string;
  photo_url?: string;
  slug: string;
  parent_id?: number;
  parent_name: string
}

export interface PageInfo {
  current_page: number;
  item_count: number;
  items_per_page: number;
  page_count: number;
}

export interface CategoriesListData {
  categories: Categories[];
  page_info: PageInfo;
}

export const defaultCategoryListData: CategoriesListData = {
  categories: [],
  page_info: {
    current_page: 0,
    item_count: 0,
    items_per_page: 0,
    page_count: 0,
  },
}

export interface UserPayments {
  id: number;
  name: string;
}

export interface Payments {
  id: number;
  invoice_number: string;
  user: UserPayments;
  file_url: string;
  is_confirmed: boolean;
  amount: string;
}

export interface PaymentsData {
  page_info: PageInfo;
  payments: Payments[];
}

export interface DetailProductResponse extends APIResponse<ProductDetails> { }
export interface CategoriesListResponse
  extends APIResponse<CategoriesListData> {}
export interface CategoriesResponse extends APIResponse<CategoryWithParentName> {}
