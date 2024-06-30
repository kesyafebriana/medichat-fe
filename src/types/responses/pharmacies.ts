import { PageInfo } from ".";

export interface Pharmacies {
	id: number;
	name: string;
	slug: string;
	manager_id: number;
	address: string;
	coordinate: Coordinate;
	pharmacist_name: string;
	pharmacist_license: string;
	pharmacist_phone: string;
	pharmacy_operations: PharmacyOperation[];
	pharmacy_shipment_methods: PharmacyShipmentMethod[];

	distance?: number;
}

export interface PaginatedPharmacies {
	pharmacies: Pharmacies[];
	page_info: PageInfo;
}

export interface PharmaciesWithStock extends Pharmacies {
	stock: {
		id: number;
		product_id: string;
		pharmacy_id: string;
		stock: number;
		price: number;
	};
}

export interface PharmaciesPaginatedResponse {
	pharmacies: Pharmacies[];
	page_info: PageInfo;
}

export interface Coordinate {
	lon: number;
	lat: number;
}

export interface PharmacyOperation {
	id: number;
	day: string;
	start_time: string;
	end_time: string;
}

export interface PharmacyShipmentMethod {
	id: number;
	pharmacy_id: number;
	shipment_method_id: number;
	shipment_method: string;
}
