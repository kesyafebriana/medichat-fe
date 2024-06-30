import { TableColumn, TableData } from "@/components/ui/Table";
import {
	PharmacyShipmentMethod,
	PharmacyOperation,
	Pharmacies,
} from "../responses/pharmacies";

export interface PharmaciesRowData {
	id: number;
	name: string;
	slug: string;
	manager_id: number;
	address: string;
	coordinate_lat: number;
	coordinate_lon: number;
	pharmacist_name: string;
	pharmacist_license: string;
	pharmacist_phone: string;
	pharmacy_operations: PharmacyOperation[];
	pharmacy_shipment_methods: PharmacyShipmentMethod[];
}

export const pharmaciesTableColumn: TableColumn[] = [
	{
		key: "id",
		label: "Pharmacies ID",
	},
	{
		key: "name",
		label: "Pharmacies Name",
	},
	{
		key: "address",
		label: "Address",
	},
	{
		key: "pharmacist_name",
		label: "Pharmacist Name",
	},
	{
		key: "pharmacist_license",
		label: "Pharmacist License",
	},
	{
		key: "pharmacist_phone",
		label: "Pharmacist Phone",
	},
];

export const toPharmaciesRowData = (
	pharmacies: Pharmacies
): PharmaciesRowData => {
	return {
		id: pharmacies.id,
		name: pharmacies.name,
		slug: pharmacies.slug,
		manager_id: pharmacies.manager_id,
		address: pharmacies.address,
		coordinate_lat: pharmacies.coordinate.lat,
		coordinate_lon: pharmacies.coordinate.lon,
		pharmacist_name: pharmacies.pharmacist_name,
		pharmacist_license: pharmacies.pharmacist_license,
		pharmacist_phone: pharmacies.pharmacist_phone,
		pharmacy_operations: pharmacies.pharmacy_operations,
		pharmacy_shipment_methods: pharmacies.pharmacy_shipment_methods,
	};
};

export const toPharmaciesTableData = (
	pharmacies: Pharmacies[]
): TableData[] => {
	const results: TableData[] = [];
	for (let i = 0; i < pharmacies.length; i++) {
		results.push(toPharmaciesRowData(pharmacies[i]) as unknown as TableData);
	}
	return results;
};
