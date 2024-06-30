import { TableColumn, TableData } from "@/components/ui/Table";
import { StockMutationJoined } from "../responses/stock";

export interface StockMutationJoinedRowData {
	id: number;

	source_id: number;
	source_pharmacy_id: number;
	source_pharmacy_slug: string;
	source_pharmacy_name: string;

	target_id: number;
	target_pharmacy_id: number;
	target_pharmacy_slug: string;
	target_pharmacy_name: string;

	product_id: number;
	product_slug: string;
	product_name: string;

	method: string;
	status: string;
	amount: number;
	created_at: string;
}

export const stockMutationJoinedTableColumn: TableColumn[] = [
	{
		key: "id",
		label: "Mutation ID",
	},
	{
		key: "created_at",
		label: "Created at",
	},
	{
		key: "source_pharmacy_name",
		label: "Source pharmacy",
	},
	{
		key: "target_pharmacy_name",
		label: "Target pharmacy",
	},
	{
		key: "product_name",
		label: "Product",
	},
	{
		key: "method",
		label: "Method",
	},
	{
		key: "amount",
		label: "Amount",
	},
];

export const toStockMutationJoinedRowData = (
	mutation: StockMutationJoined
): StockMutationJoinedRowData => {
	return {
		id: mutation.id,

		source_id: mutation.source.id,
		source_pharmacy_id: mutation.source.pharmacy_id,
		source_pharmacy_slug: mutation.source.pharmacy_slug,
		source_pharmacy_name: mutation.source.pharmacy_name,

		target_id: mutation.target.id,
		target_pharmacy_id: mutation.target.pharmacy_id,
		target_pharmacy_slug: mutation.target.pharmacy_slug,
		target_pharmacy_name: mutation.target.pharmacy_name,

		product_id: mutation.product.id,
		product_slug: mutation.product.slug,
		product_name: mutation.product.name,

		method: mutation.method,
		status: mutation.status,
		amount: mutation.amount,
		created_at: mutation.created_at,
	};
};

export const toStockMutationJoinedTableData = (
	mutations: StockMutationJoined[]
): TableData[] => {
	const results: TableData[] = [];
	for (let i = 0; i < mutations.length; i++) {
		results.push(
			toStockMutationJoinedRowData(mutations[i]) as unknown as TableData
		);
	}
	return results;
};
