import { categorySortBy, sort, stockSortBy } from "@/constants/params";
import { isValidSort, isValidSortBy } from "@/utils/checker";
import { Flex, Select, Text } from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const CategorySortPicker = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);

	const sortParam = urlParams.get("sort");
	let s = sort.ASC;
	if (!sortParam) {
		urlParams.set("sort", sort.ASC);
	}

	if (sortParam) {
		if (isValidSort(sortParam)) {
			s = sortParam;
			urlParams.set("sort", sortParam);
		} else {
			urlParams.set("sort", sort.ASC);
		}
	}

	const sortByParam = urlParams.get("sort_by");
	let sB = categorySortBy.CategoryName;
	if (!sortByParam) {
		urlParams.set("sort_by", categorySortBy.CategoryName);
	}

	if (sortByParam) {
		if (
			isValidSortBy(sortByParam, [
				categorySortBy.CategoryName,
				categorySortBy.Level,
				categorySortBy.Parent,
			])
		) {
			sB = sortByParam;
			urlParams.set("sort_by", sortByParam);
		} else {
			urlParams.set("sort_by", categorySortBy.CategoryName);
		}
	}

	const onChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
		urlParams.set("sort", e.currentTarget.value);
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
					<option value={"category_name"}>Name</option>
					<option value={"level"}>Level</option>
					<option value={"parent"}>Parent</option>
				</Select>
			</Flex>
			<Select width={100} defaultValue={s} onChange={onChangeSort}>
				<option value="asc">ASC</option>
				<option value="desc">DESC</option>
			</Select>
		</Flex>
	);
};

export default CategorySortPicker;
