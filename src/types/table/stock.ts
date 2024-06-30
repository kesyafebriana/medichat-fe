import { TableColumn, TableData } from "@/components/ui/Table";
import { StockJoined } from "../responses/stock";
import { toRupiah } from "@/utils/convert";

export interface StockJoinedRowData {
	id: number;
	product_id: number;
	product_slug: string;
	product_name: string;

	pharmacy_id: number;
	pharmacy_slug: string;
	pharmacy_name: string;

	stock: number;
	price: number;
	price_string: string;
}

export const stockJoinedTableColumn: TableColumn[] = [
	{
		key: "id",
		label: "Stock ID",
	},
	{
		key: "product_name",
		label: "Product Name",
	},
	{
		key: "pharmacy_name",
		label: "Pharmacy",
	},
	{
		key: "stock",
		label: "Stock",
	},
	{
		key: "price_string",
		label: "Price",
	},
];

export const toStockJoinedRowData = (
	stock: StockJoined
): StockJoinedRowData => {
	return {
		id: stock.id,
		product_id: stock.product.id,
		product_slug: stock.product.slug,
		product_name: stock.product.name,

		pharmacy_id: stock.pharmacy.id,
		pharmacy_slug: stock.pharmacy.slug,
		pharmacy_name: stock.pharmacy.name,

		stock: stock.stock,
		price: stock.price,
		price_string: toRupiah(stock.price),
	};
};

export const toStockJoinedTableData = (stocks: StockJoined[]): TableData[] => {
	const results: TableData[] = [];
	for (let i = 0; i < stocks.length; i++) {
		results.push(toStockJoinedRowData(stocks[i]) as unknown as TableData);
	}
	return results;
};
