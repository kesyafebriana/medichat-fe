import { sortProduct, productSortBy } from "@/constants/params";
import { isValidSort, isValidSortBy } from "@/utils/checker";
import { Flex, Select, Text } from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const ProductSortPicker = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);

	const sortParam = urlParams.get("sort_type");
	let s = sortProduct.ASC;
	if (!sortParam) {
		urlParams.set("sort_type", sortProduct.ASC);
	}

	if (sortParam) {
		if (isValidSort(sortParam)) {
			s = sortParam;
			urlParams.set("sort_type", sortParam);
		} else {
			urlParams.set("sort_type", sortProduct.ASC);
		}
	}

	const sortByParam = urlParams.get("sort_by");
	let sB = productSortBy.CategoryName;
	if (!sortByParam) {
		urlParams.set("sort_by", productSortBy.ProductName);
	}

	if (sortByParam) {
		if (
			isValidSortBy(sortByParam, [
				productSortBy.ProductName,
				productSortBy.CategoryName,
			])
		) {
			sB = sortByParam;
			urlParams.set("sort_by", sortByParam);
		} else {
			urlParams.set("sort_by", productSortBy.CategoryName);
		}
	}

	const onChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
		urlParams.set("sort_type", e.currentTarget.value);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
		urlParams.set("sort_by", e.currentTarget.value);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	return (
		<Flex columnGap={4}>
			<Flex alignItems={"center"} columnGap={2}>
				<Text>Sort:</Text>
				<Select width={180} defaultValue={sB} onChange={onChangeSortBy}>
					<option value={"product_name"}>Name</option>
				</Select>
			</Flex>
			<Select width={100} defaultValue={s} onChange={onChangeSort}>
				<option value="asc">ASC</option>
				<option value="desc">DESC</option>
			</Select>
		</Flex>
	);
};

export default ProductSortPicker;
