import { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { Order, OrderItem } from "../responses/order";
import { Categories } from "../responses/admin";
import { OrderRowData } from "./order";
import { Category, CategoryWithParentName } from "../responses/category";

export type CategoryLevel =
	| "1"
	| "2"

export interface CategoryRowData {
	id: number;
	category_name: string;
    level: string;
    parent_name: string;
}

const defaultCategoryTableColumn = [
	{
		key: "category_name",
		label: "Category Name",
	},
	{
		key: "level",
		label: "Level",
	},
	{
		key: "parent_name",
		label: "Parent",
    }
];

export const getCategoryTableColumn = (type: CategoryLevel): TableColumn[] => {
	return defaultCategoryTableColumn;
};

export const toCategoryRowData = (category: CategoryWithParentName): CategoryRowData => {
        return {
            id: category.id,
            category_name: category.name,
            level: (category.parent_name) ? "2" : "1",
            parent_name: category.parent_name ? category.parent_name : "-",
        };
};

export const toCategoryTableData = (categories: CategoryWithParentName[]): TableData[] => {
	const results: TableData[] = [];
	for (let i = 0; i < categories.length; i++) {
            results.push(toCategoryRowData(categories[i]) as unknown as TableData);
	}
	return results;
};
