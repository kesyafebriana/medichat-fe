import {
	Flex,
	IconButton,
	Spinner,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import {
	OrderRowData,
	OrderType,
	getOrderTableColumn,
	toOrderTableData,
} from "@/types/table/order";
import { PaginatedOrder } from "@/types/responses/order";
import Table, { TableData } from "../ui/Table";
import { usePathname, useSearchParams } from "next/navigation";
import Paginator from "../ui/Paginator";
import { useRouter } from "next/router";
import { isValidOrderStatus } from "@/types/requests/order";
import { OrderStatus } from "@/constants/order";
import DetailOrderModal from "../modal/DetailOrderModal";
import Alert from "../modal/Alert";
import { cancelOrder, sendOrder } from "@/services/order";

const OrderTable = ({ access_token }: { access_token: string }) => {
	const toast = useToast();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);
	const router = useRouter();
	const pathname = usePathname();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [selectedOrder, setSelectedOrder] = React.useState<OrderRowData>();

	const {
		isOpen: isSendAlertOpen,
		onClose: onSendAlertClose,
		onOpen: onSendAlertOpen,
	} = useDisclosure();
	const sendAlertCancelRef = React.useRef(null);

	const {
		isOpen: isCancelledAlertOpen,
		onClose: onCancelledAlertClose,
		onOpen: onCancelledAlertOpen,
	} = useDisclosure();
	const cancelledAlertCancelRef = React.useRef(null);

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
	let status = OrderStatus.WaitingPayment;
	if (!statusParam) {
		urlParams.set("status", OrderStatus.WaitingPayment);
	}

	if (statusParam) {
		if (isValidOrderStatus(statusParam)) {
			status = statusParam;
			urlParams.set("status", statusParam);
		} else {
			urlParams.set("status", OrderStatus.WaitingPayment);
		}
	}

	const {
		data: orderRes,
		isLoading,
		mutate,
	} = useAPIFetcher<PaginatedOrder>(`orders?${urlParams.toString()}&limit=9`, {
		accessToken: access_token,
	});

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

	const onClickRow = (rowData: TableData) => {
		const data = rowData as unknown as OrderRowData;
		openDetailOrderModal(data);
	};

	const openDetailOrderModal = (data: OrderRowData) => {
		setSelectedOrder(data);
		onOpen();
	};

	const onSendOrder = async () => {
		try {
			if (selectedOrder) {
				await sendOrder(selectedOrder.id, access_token);
				toast({
					title: "Order status changed to sent",
					description: "Successfully change order status to sent",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				mutate();
			}
		} catch (e) {
			toast({
				title: "Failed to change order status",
				description: "Failed change order status to sent",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const onCancelOrder = async () => {
		try {
			if (selectedOrder) {
				await cancelOrder(selectedOrder.id, access_token);
				toast({
					title: "Cancel order",
					description: "Successfully mark order as cancelled",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				mutate();
			}
		} catch (e) {
			toast({
				title: "Cancel order",
				description: "Failed to mark order as cancelled",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const actionColumn = (rowData: TableData) => {
		const data = rowData as unknown as OrderRowData;
		if (data.status === OrderStatus.Processing) {
			return (
				<Flex columnGap={4}>
					<Tooltip label="Send order">
						<IconButton
							aria-label="send order"
							colorScheme="green"
							onClick={(e) => {
								setSelectedOrder(data);
								onSendAlertOpen();
								e.stopPropagation();
							}}
						>
							<i className="fa-solid fa-paper-plane"></i>
						</IconButton>
					</Tooltip>
					<Tooltip label="Mark as cancelled">
						<IconButton
							aria-label="cancel order"
							colorScheme="red"
							onClick={(e) => {
								setSelectedOrder(data);
								onCancelledAlertOpen();
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

		return undefined;
	};

	return (
		<>
			<Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
				<Table
					columns={getOrderTableColumn(status as OrderType)}
					data={toOrderTableData(orderRes?.data?.orders ?? [])}
					onClickRow={onClickRow}
					actionColumn={actionColumn}
				/>
				<Flex columnGap={5} alignItems={"center"}>
					{
						<Paginator
							onNext={onNext}
							onPrev={onPrev}
							pageInfo={orderRes?.data?.page_info}
						/>
					}
				</Flex>
			</Flex>
			<DetailOrderModal
				isOpen={isOpen}
				onClose={onClose}
				access_token={access_token}
				orderRowData={selectedOrder}
			/>
			<Alert
				isOpen={isSendAlertOpen}
				onClose={onSendAlertClose}
				cancelRef={sendAlertCancelRef}
				header="Confirmation"
				onOK={onSendOrder}
			>
				Are you sure to send order?
			</Alert>
			<Alert
				isOpen={isCancelledAlertOpen}
				onClose={onCancelledAlertClose}
				cancelRef={cancelledAlertCancelRef}
				header="Confirmation"
				onOK={onCancelOrder}
				okButtonColorScheme="red"
			>
				Are you sure to mark order as cancelled?
			</Alert>
		</>
	);
};

export default OrderTable;
