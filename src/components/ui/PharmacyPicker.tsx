import React from "react";
import { AsyncSelect, SingleValue } from "chakra-react-select";
import * as _ from "lodash";
import { getOwnPharmacies } from "@/services/pharmacies";
import useSession from "@/hooks/useSession";

const PharmacyPicker = ({
	onChange,
	placeholder = "Choose pharmacy",
}: PharmacyPickerProps) => {
	const { session } = useSession();
	return (
		<>
			<AsyncSelect
				onChange={onChange}
				name="products"
				placeholder={placeholder}
				loadOptions={_.debounce((inputValue, callback) => {
					const findProducts = async (term: string) => {
						try {
							const res = await getOwnPharmacies(
								{
									term: term,
								},
								session?.access_token ?? ""
							);
							const result = res?.data?.pharmacies.map((p) => ({
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

interface PharmacyPickerProps {
	placeholder?: string;
	onChange: (newValue: SingleValue<string>) => void;
}

export default PharmacyPicker;
