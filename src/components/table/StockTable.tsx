import {
	Button,
	Flex,
	IconButton,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import Table from "../ui/Table";
import {
	StockJoinedRowData,
	stockJoinedTableColumn,
	toStockJoinedTableData,
} from "@/types/table/stock";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import { PaginatedStockJoined } from "@/types/responses/stock";
import Paginator from "../ui/Paginator";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { sort, stockSortBy } from "@/constants/params";
import { isValidSort, isValidSortBy } from "@/utils/checker";
import { TableData } from "../ui/TableAdmin";
import DeleteAlert from "../modal/DeleteAlert";
import { deleteStock } from "@/services/stock";
import UpdateStockModal from "../modal/UpdateStockModal";
import CreateStockModal from "../modal/CreateStockModal";
import { colors } from "@/constants/colors";
import StockSortPicker from "../ui/StockSortPicker";

const StockTable = ({ access_token }: { access_token: string }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const urlParams = new URLSearchParams(searchParams);
	const toast = useToast();

	const [selectedStock, setSelectedStock] =
		React.useState<StockJoinedRowData>();

	const {
		isOpen: isDeleteStockOpen,
		onClose: onDeleteStockClose,
		onOpen: onDeleteStockOpen,
	} = useDisclosure();
	const deleteStockCancelRef = React.useRef(null);

	const {
		isOpen: isOpenUpdateStockModal,
		onClose: onCloseUpdateStockModal,
		onOpen: onOpenUpdateStockModal,
	} = useDisclosure();

	const {
		isOpen: isOpenCreateStockModal,
		onClose: onCloseCreateStockModal,
		onOpen: onOpenCreateStockModal,
	} = useDisclosure();

	const pageParam = urlParams.get("page");
	let page: number = 1;
	if (!pageParam) {
		urlParams.set("page", "1");
	}

	if (pageParam) {
		if (!isNaN(+pageParam)) {
			page = +pageParam;
			urlParams.set("page", pageParam);
		} else {
			urlParams.set("page", "1");
		}
	}

	const sortParam = urlParams.get("sort");
	if (!sortParam) {
		urlParams.set("sort", sort.ASC);
	}

	if (sortParam) {
		if (isValidSort(sortParam)) {
			urlParams.set("sort", sortParam);
		} else {
			urlParams.set("sort", sort.ASC);
		}
	}

	const sortByParam = urlParams.get("sort_by");
	if (!sortByParam) {
		urlParams.set("sort_by", stockSortBy.ProductName);
	}

	if (sortByParam) {
		if (
			isValidSortBy(sortByParam, [
				stockSortBy.Amount,
				stockSortBy.PharmacyName,
				stockSortBy.Price,
				stockSortBy.ProductName,
			])
		) {
			urlParams.set("sort_by", sortByParam);
		} else {
			urlParams.set("sort_by", stockSortBy.ProductName);
		}
	}

	const {
		data: stockRes,
		isLoading,
		mutate,
	} = useAPIFetcher<PaginatedStockJoined>(
		`stocks?${urlParams.toString()}&limit=8`,
		{
			accessToken: access_token,
		}
	);

	if (isLoading) {
		return (
			<Flex
				className="h-full w-full"
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Spinner />
			</Flex>
		);
	}

	const onNext = () => {
		urlParams.set("page", `${page + 1}`);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	const onPrev = () => {
		if (page === 1) return;
		urlParams.set("page", `${page - 1}`);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	const onDeleteStock = async () => {
		try {
			if (selectedStock) {
				await deleteStock(selectedStock.id, access_token);
				toast({
					title: "Stock deleted",
					description: "Successfully delete stock",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				onDeleteStockClose();
				mutate();
			}
		} catch (e) {
			toast({
				title: "Failed",
				description: "Failed delete stock",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const actionColumn = (rowData: TableData) => {
		const data = rowData as unknown as StockJoinedRowData;
		return (
			<Flex columnGap={4}>
				<Tooltip label="Update stock">
					<IconButton
						aria-label="update stock"
						colorScheme="yellow"
						onClick={(e) => {
							setSelectedStock(data);
							onOpenUpdateStockModal();
							e.stopPropagation();
						}}
					>
						<i className="fa-solid fa-pen-to-square"></i>
					</IconButton>
				</Tooltip>
				<Tooltip label="Delete stock">
					<IconButton
						aria-label="delete stock"
						colorScheme="red"
						onClick={(e) => {
							setSelectedStock(data);
							onDeleteStockOpen();
							e.stopPropagation();
						}}
					>
						<i className="fa-solid fa-trash"></i>
					</IconButton>
				</Tooltip>
			</Flex>
		);
	};

	return (
		<>
			<TableHeader onOpenCreateStockModal={onOpenCreateStockModal} />
			<Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
				<Table
					columns={stockJoinedTableColumn}
					data={toStockJoinedTableData(stockRes?.data?.stocks ?? [])}
					actionColumn={actionColumn}
				/>
				<Flex columnGap={5} alignItems={"center"}>
					<Paginator
						onNext={onNext}
						onPrev={onPrev}
						pageInfo={stockRes?.data?.page_info}
					/>
				</Flex>
			</Flex>
			<DeleteAlert
				isOpen={isDeleteStockOpen}
				cancelRef={deleteStockCancelRef}
				onClose={onDeleteStockClose}
				header="Delete stock"
				onDelete={onDeleteStock}
			/>
			<UpdateStockModal
				stock={selectedStock}
				isOpen={isOpenUpdateStockModal}
				onClose={onCloseUpdateStockModal}
				mutate={mutate}
			/>
			<CreateStockModal
				isOpen={isOpenCreateStockModal}
				onClose={onCloseCreateStockModal}
				mutate={mutate}
			/>
		</>
	);
};

const TableHeader = ({
	onOpenCreateStockModal,
}: {
	onOpenCreateStockModal: () => void;
}) => {
	return (
		<Flex alignItems={"center"} justifyContent={"space-between"}>
			<Text fontSize={30} color={colors.primary}>
				Stock
			</Text>
			<Flex columnGap={4}>
				<StockSortPicker />
				<Button
					leftIcon={<i className="fa-solid fa-plus"></i>}
					variant={"brandPrimary"}
					onClick={() => onOpenCreateStockModal()}
				>
					Create
				</Button>
			</Flex>
		</Flex>
	);
};

export default StockTable;
