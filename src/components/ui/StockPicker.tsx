import React from "react";
import { AsyncSelect, SingleValue } from "chakra-react-select";
import * as _ from "lodash";
import { getStocks } from "@/services/stock";
import useSession from "@/hooks/useSession";

const StockPicker = ({
	onChange,
	target_pharmacy_slug,
	source_pharmacy_slug,
}: StockPickerProps) => {
	const { session } = useSession();
	return (
		<>
			<AsyncSelect
				onChange={onChange}
				name="products"
				placeholder="Choose product"
				loadOptions={_.debounce((inputValue, callback) => {
					const findProducts = async (term: string) => {
						try {
							const [sourceRes, targetRes] = await Promise.all([
								await getStocks(
									{
										product_name: term,
										pharmacy_slug: source_pharmacy_slug,
									},
									session?.access_token ?? ""
								),
								await getStocks(
									{
										product_name: term,
										pharmacy_slug: target_pharmacy_slug,
									},
									session?.access_token ?? ""
								),
							]);

							const results = targetRes?.data?.stocks.filter((t) =>
								sourceRes?.data?.stocks.some(
									(s) => s.product.id === t.product.id
								)
							);

							const options = results?.map((p) => ({
								value: p.product.slug,
								label: p.product.name,
								meta: {
									stock: p.stock,
								},
							}));

							callback(options ?? []);
						} catch (e) {
							callback([]);
						}
					};
					findProducts(inputValue);
				}, 250)}
			/>
		</>
	);
};

interface StockPickerProps {
	onChange: (newValue: SingleValue<string>) => void;
	source_pharmacy_slug: string;
	target_pharmacy_slug: string;
}

export default StockPicker;
