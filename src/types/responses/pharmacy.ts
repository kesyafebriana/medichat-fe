import { StockResponse } from "./stock";

export interface PharmacyResponse {
  id: number;
  name: string;
  slug: string;
  manager_id: number;
  address: string;
  coordinate: {
    lon: number;
    lat: number;
  };
  pharmacist_name: string;
  pharmacist_license: string;
  pharmacist_phone: string;
  pharmacy_operations?: PharmacyOperationResponse[];
  pharmacy_shipment_methods?: PharmacyShipmentMethodResponse[];
  stock?: StockResponse;

	distance?: number;
}

export interface PharmacyOperationResponse {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

export interface PharmacyShipmentMethodResponse {
  id: number;
  pharmacy_id: number;
  shipment_method_id: number;
  shipment_method: string;
}

export interface PharmacyPaginatedResponse {
  pharmacies: PharmacyResponse[];
  page_info: {
    current_page: number;
    item_count: number;
    items_per_page: number;
    page_count: number;
  };
}

export const defaultPharmacyPaginatedResponse: PharmacyPaginatedResponse = {
  pharmacies: [],
  page_info: {
    current_page: 0,
    item_count: 0,
    items_per_page: 0,
    page_count: 0,
  },
};
