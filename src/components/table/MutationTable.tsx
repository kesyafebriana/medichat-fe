import useAPIFetcher from "@/hooks/useAPIFetcher";
import { PaginatedStockMutationJoined } from "@/types/responses/stock";
import {
	Button,
	Flex,
	Spinner,
	Text,
	useDisclosure,
	Tooltip,
	IconButton,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import Table from "../ui/Table";
import {
	StockMutationJoinedRowData,
	stockMutationJoinedTableColumn,
	toStockMutationJoinedTableData,
} from "@/types/table/mutation";
import Paginator from "../ui/Paginator";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { colors } from "@/constants/colors";
import CreateMutationModal from "../modal/CreateMutationModal";
import { MutationStatus } from "@/constants/mutation";
import {
	isValidMutationMethod,
	isValidMutationStatus,
	isValidSort,
	isValidSortBy,
} from "@/utils/checker";
import { TableData } from "../ui/TableAdmin";
import { approveStockTransfer, cancelStockTransfer } from "@/services/stock";
import Alert from "../modal/Alert";
import StockSortPicker from "../ui/StockSortPicker";
import { sort, stockSortBy } from "@/constants/params";

const MutationTable = ({ access_token }: { access_token: string }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const urlParams = new URLSearchParams(searchParams);
	const [selectedMutation, setSelectedMutation] =
		React.useState<StockMutationJoinedRowData>();
	const toast = useToast();

	const {
		isOpen: isOpenCreateMutationModal,
		onClose: onCloseCreateMutationModal,
		onOpen: onOpenCreateMutationModal,
	} = useDisclosure();

	const {
		isOpen: isApproveAlertOpen,
		onClose: onApproveAlertClose,
		onOpen: onApproveAlertOpen,
	} = useDisclosure();
	const approveAlertCancelRef = React.useRef(null);

	const {
		isOpen: isDeclineAlertOpen,
		onClose: onDeclineAlertClose,
		onOpen: onDeclineAlertOpen,
	} = useDisclosure();
	const declineAlertCancelRef = React.useRef(null);

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

	const statusParam = urlParams.get("status");
	if (!statusParam) {
		urlParams.set("status", MutationStatus.Pending);
	}

	if (statusParam) {
		if (isValidMutationStatus(statusParam)) {
			urlParams.set("status", statusParam);
		} else {
			urlParams.set("status", MutationStatus.Pending);
		}
	}

	const methodParam = urlParams.get("method");
	if (methodParam && isValidMutationMethod(methodParam)) {
		urlParams.set("method", methodParam);
	}

	if (methodParam && !isValidMutationMethod(methodParam)) {
		urlParams.delete("method", methodParam);
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
		data: mutationRes,
		isLoading,
		mutate,
	} = useAPIFetcher<PaginatedStockMutationJoined>(
		`stocks/mutations?${urlParams.toString()}&limit=8`,
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

	const onApproveMutation = async () => {
		try {
			if (selectedMutation) {
				await approveStockTransfer(selectedMutation.id, access_token);
				toast({
					title: "Mutation approval",
					description: "Successfully approve mutation",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				mutate();
			}
		} catch (e) {
			toast({
				title: "Mutation approval",
				description: "Failed approve mutation",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const onDeclineMutation = async () => {
		try {
			if (selectedMutation) {
				await cancelStockTransfer(selectedMutation.id, access_token);
				toast({
					title: "Mutation approval",
					description: "Successfully decline mutation",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				mutate();
			}
		} catch (e) {
			toast({
				title: "Mutation approval",
				description: "Failed decline mutation",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const actionColumn = (rowData: TableData) => {
		const data = rowData as unknown as StockMutationJoinedRowData;
		if (data.status === MutationStatus.Pending) {
			return (
				<Flex columnGap={4}>
					<Tooltip label="Approve">
						<IconButton
							aria-label="approve"
							colorScheme="green"
							onClick={(e) => {
								setSelectedMutation(data);
								onApproveAlertOpen();
								e.stopPropagation();
							}}
						>
							<i className="fa-solid fa-check"></i>
						</IconButton>
					</Tooltip>
					<Tooltip label="Decline">
						<IconButton
							aria-label="decline"
							colorScheme="red"
							onClick={(e) => {
								setSelectedMutation(data);
								onDeclineAlertOpen();
								e.stopPropagation();
							}}
							className="text-white"
						>
							<i className="fa-solid fa-circle-xmark"></i>
						</IconButton>
					</Tooltip>
				</Flex>
			);
		}
	};

	return (
		<>
			<TableHeader onOpenCreateMutationModal={onOpenCreateMutationModal} />
			<Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
				<Table
					columns={stockMutationJoinedTableColumn}
					data={toStockMutationJoinedTableData(
						mutationRes?.data?.stock_mutations ?? []
					)}
					actionColumn={actionColumn}
				/>
				<Flex columnGap={5} alignItems={"center"}>
					<Paginator
						onNext={onNext}
						onPrev={onPrev}
						pageInfo={mutationRes?.data?.page_info}
					/>
				</Flex>
			</Flex>
			<CreateMutationModal
				isOpen={isOpenCreateMutationModal}
				onClose={onCloseCreateMutationModal}
				mutate={mutate}
			/>
			<Alert
				isOpen={isApproveAlertOpen}
				onClose={onApproveAlertClose}
				cancelRef={approveAlertCancelRef}
				header="Confirmation"
				onOK={onApproveMutation}
			>
				Are you sure to approve stock mutation?
			</Alert>
			<Alert
				isOpen={isDeclineAlertOpen}
				onClose={onDeclineAlertClose}
				cancelRef={declineAlertCancelRef}
				header="Confirmation"
				okButtonColorScheme="red"
				onOK={onDeclineMutation}
			>
				Are you sure to decline stock mutation?
			</Alert>
		</>
	);
};

const TableHeader = ({
	onOpenCreateMutationModal,
}: {
	onOpenCreateMutationModal: () => void;
}) => {
	return (
		<Flex alignItems={"center"} justifyContent={"space-between"}>
			<Text fontSize={30} color={colors.primary}>
				Mutation
			</Text>
			<Flex columnGap={4}>
				<StockSortPicker />
				<Button
					leftIcon={<i className="fa-solid fa-plus"></i>}
					variant={"brandPrimary"}
					onClick={() => onOpenCreateMutationModal()}
				>
					Create
				</Button>
			</Flex>
		</Flex>
	);
};

export default MutationTable;
