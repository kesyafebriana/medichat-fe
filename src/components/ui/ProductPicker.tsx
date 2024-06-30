import React from "react";
import { AsyncSelect, SingleValue } from "chakra-react-select";
import { getProducts } from "@/services/product";
import * as _ from "lodash";

const ProductPicker = ({ onChange }: ProductPickerProps) => {
	return (
		<>
			<AsyncSelect
				onChange={onChange}
				name="products"
				placeholder="Choose product"
				loadOptions={_.debounce((inputValue, callback) => {
					const findProducts = async (term: string) => {
						try {
							const res = await getProducts({
								term: term,
							});
							const result = res?.data?.products.map((p) => ({
								value: p.slug,
								label: p.name,
							}));

							callback(result ?? []);
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

interface ProductPickerProps {
	onChange: (newValue: SingleValue<string>) => void;
}

export default ProductPicker;
