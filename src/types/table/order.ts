import { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { Order, OrderItem } from "../responses/order";
import { format } from "date-fns";
import { toRupiah } from "@/utils/convert";

export type OrderType =
	| "waiting for payment"
	| "Waiting for confirmation"
	| "processing"
	| "sent"
	| "finished"
	| "cancelled";

export interface OrderRowData {
	id: number;
	user_id: number;
	user_name: string;
	pharmacy_id: number;
	pharmacy_slug: string;
	pharmacy_name: string;
	shipment_method_id: number;
	shipment_method_name: string;
	address: string;
	coordinate_lat: number;
	coordinate_lon: number;
	n_items: number;
	subtotal: number;
	subtotal_string: string;
	shipment_fee: number;
	shipment_fee_string: string;
	total: number;
	total_string: string;
	status: string;
	ordered_at: string;
	finished_at: string;
	items: OrderItem[];
}

const defaultOrderTableColumn = [
	{
		key: "id",
		label: "Order ID",
	},
	{
		key: "ordered_at",
		label: "Ordered at",
	},
	{
		key: "pharmacy_name",
		label: "Pharmacy",
	},
	{
		key: "user_name",
		label: "Customer",
	},
	{
		key: "address",
		label: "address",
	},
	{
		key: "shipment_method_name",
		label: "Shipment method",
	},
	{
		key: "shipment_fee_string",
		label: "Shipment Fee",
	},
	{
		key: "subtotal_string",
		label: "Total items price",
	},
	{
		key: "total_string",
		label: "Total price",
	},
];
const waitingOrderTableColumn = defaultOrderTableColumn;
const finishedOrderTableColumn = [
	{
		key: "id",
		label: "Order ID",
	},
	{
		key: "ordered_at",
		label: "Ordered at",
	},
	{
		key: "finished_at",
		label: "Finished at",
	},
	{
		key: "pharmacy_name",
		label: "Pharmacy",
	},
	{
		key: "user_name",
		label: "Customer",
	},
	{
		key: "address",
		label: "address",
	},
	{
		key: "shipment_method_name",
		label: "Shipment method",
	},
	{
		key: "shipment_fee_string",
		label: "Shipment Fee",
	},
	{
		key: "subtotal_string",
		label: "Total items price",
	},
	{
		key: "total_string",
		label: "Total price",
	},
];

export const getOrderTableColumn = (type: OrderType): TableColumn[] => {
	if (type === "Waiting for confirmation") {
		return waitingOrderTableColumn;
	}

	if (type === "finished") {
		return finishedOrderTableColumn;
	}
	return defaultOrderTableColumn;
};

export const toOrderRowData = (order: Order): OrderRowData => {
	return {
		id: order.id,
		user_id: order.user.id,
		user_name: order.user.name,
		pharmacy_id: order.pharmacy.id,
		pharmacy_slug: order.pharmacy.slug,
		pharmacy_name: order.pharmacy.name,
		shipment_method_id: order.shipment_method.id,
		shipment_method_name: order.shipment_method.name,
		address: order.address,
		coordinate_lat: order.coordinate.lat,
		coordinate_lon: order.coordinate.lon,
		n_items: order.n_items,
		subtotal: order.subtotal,
		subtotal_string: toRupiah(order.subtotal),
		shipment_fee: order.shipment_fee,
		shipment_fee_string: toRupiah(order.shipment_fee),
		total: order.total,
		total_string: toRupiah(order.total),
		status: order.status,
		ordered_at: format(
			new Date(order.ordered_at.split(".")[0]).toLocaleString("en-US", {
				timeZone: "Asia/Jakarta",
			}),
			"dd/MM/yyyy HH:mm"
		),
		finished_at: order.finished_at
			? format(
					new Date(order.finished_at.split(".")[0]).toLocaleString("en-US", {
						timeZone: "Asia/Jakarta",
					}),
					"dd/MM/yyyy HH:mm"
			  )
			: "",
		items: order.items,
	};
};

export const toOrderTableData = (orders: Order[]): TableData[] => {
	const results: TableData[] = [];
	for (let i = 0; i < orders.length; i++) {
		results.push(toOrderRowData(orders[i]) as unknown as TableData);
	}
	return results;
};
