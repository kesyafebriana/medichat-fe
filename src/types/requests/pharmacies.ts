interface Coordinate {
	lon: number;
	lat: number;
}

interface PharmacyShipmentMethod {
	shipment_method_id: number;
}

export interface PharmacyOperation {
	day: string;
	start_time: string;
	end_time: string;
}

export interface PharmacyOperationRequest {
	day: string;
	start_time: string;
	end_time: string;
}

export interface CreatePharmacyRequest {
	name: string;
	address: string;
	coordinate: Coordinate;
	pharmacist_name: string;
	pharmacist_license: string;
	pharmacist_phone: string;
	pharmacy_operations: PharmacyOperation[];
	pharmacy_shipment_methods: PharmacyShipmentMethod[];
}

export interface UpdatePharmacyRequest {
	name: string;
	address: string;
	coordinate: Coordinate;
	pharmacist_name: string;
	pharmacist_license: string;
	pharmacist_phone: string;
}

export interface UpdateShipmentMethodRequest {
	slug: string;
	pharmacy_id: number;
	shipment_method_id: number;
}

export interface PharmacyListQuery {
	manager_id?: number;
	term?: string;
	name?: string;
	day?: string;
	start_time?: string;
	end_time?: string;
	long?: number;
	lat?: number;
	sort_by?: string;
	sort?: string;
	page?: number;
	limit?: number;
	is_open?: boolean;
	product_slug?: string;
}

export const toPharmacyListQueryString = (query: PharmacyListQuery): string => {
	const urlParams = new URLSearchParams();
	if (query.manager_id) urlParams.set("manager_id", "" + query.manager_id);
	if (query.name) urlParams.set("name", "" + query.name);
	if (query.term) urlParams.set("term", "" + query.term);
	if (query.day) urlParams.set("day", "" + query.day);
	if (query.start_time) urlParams.set("start_time", "" + query.start_time);
	if (query.end_time) urlParams.set("end_time", "" + query.end_time);
	if (query.long) urlParams.set("long", "" + query.long);
	if (query.lat) urlParams.set("lat", "" + query.lat);
	if (query.sort_by) urlParams.set("sort_by", "" + query.sort_by);
	if (query.sort) urlParams.set("sort", "" + query.sort);
	if (query.page) urlParams.set("page", "" + query.page);
	if (query.limit) urlParams.set("limit", "" + query.limit);
	if (query.is_open) urlParams.set("is_open", "" + query.is_open);
	if (query.product_slug)
		urlParams.set("product_slug", "" + query.product_slug);
	return urlParams.toString();
};
