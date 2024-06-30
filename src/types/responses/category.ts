export interface Category {
	id: number;
	name: string;
	slug: string;
	photo_url: string;
}

export interface CategoryWithParentName extends Category {
	parent_name?: string;
}

export interface CategoryPaginatedResponse {
	categories: Category[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}

export interface CategoryPaginatedWithParentNameResponse {
	categories: CategoryWithParentName[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}

export interface CategoryHierarchy {
	parent: Category;
	childrens: Category[];
}

export const defaultCategoryWithParentName: CategoryWithParentName = {
	id: 0,
	name: "",
	slug: "",
	photo_url: "",
}