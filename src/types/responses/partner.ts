export interface PharmacyManager {
    account_id: number;
    email: string;
    name: string;
    photo_url: string;
    profile_set: boolean;
}

export interface PharmacyManagerPaginatedResponse {
	pharmacy_managers: PharmacyManager[];
	page_info: {
		current_page: number;
		item_count: number;
		items_per_page: number;
		page_count: number;
	};
}