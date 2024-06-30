import { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { Order, OrderItem } from "../responses/order";
import { AdminProduct, Categories } from "../responses/admin";
import { OrderRowData } from "./order";
import { Category, CategoryWithParentName } from "../responses/category";
import { Product, ProductWithDetails } from "../responses/product";
import { toTitleCase } from "@/utils/case";


export interface ProductRowData {
    id: number;
    name: string;
    photo_url: string;
    category_name: string;
    product_detail_id: number;
    slug: string;
    [key: string]: string | number;
}

const defaultProductTableColumn = [
	{
		key: "name",
		label: "Product Name",
	},
	{
		key: "category_name",
		label: "Category Name",
	},
];

export const getProductTableColumn = (): TableColumn[] => {
	return defaultProductTableColumn;
};

export const toProductRowData = (product: Product, categories: Category[]): ProductRowData => {
    const category = categories.find(cat => cat.id === product.category_id);
    const categoryName = category ? category.name : 'Unknown Category';
    return {
        id: product.id,
        name: product.name,
        photo_url: product.photo_url,
        category_name: categoryName,
        product_detail_id: product.product_detail_id,
        slug: product.slug
    };
};

export const toProductTableData = (products: Product[], categories: Category[]): ProductRowData[] => {
    console.log(categories);
    return products.map(product => ({
        id: product.id,
        name: toTitleCase(product.name),
        photo_url: product.photo_url,
        category_name: getCategoryName(product.category_id, categories), // Mencari nama kategori berdasarkan ID kategori
        product_detail_id: product.product_detail_id,
        slug: product.slug
    }));
};

const getCategoryName = (categoryId: number, categories: Category[]): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
};
