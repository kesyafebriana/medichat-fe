import useAPIFetcher from "@/hooks/useAPIFetcher";
import { Order } from "@/types/responses/order";
import { OrderRowData } from "@/types/table/order";
import { toRupiah } from "@/utils/convert";
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import React from "react";

const DetailOrderModal = ({
	isOpen,
	onClose,
	access_token,
	orderRowData,
}: DetailOrderModalProps) => {
	const { data: orderDetailRes, isLoading } = useAPIFetcher<Order>(
		`orders/${orderRowData?.id}`,
		{
			accessToken: access_token,
		}
	);

	if (!orderRowData) return null;

	return (
		<Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered={true}>
			<ModalOverlay />
			<ModalContent className="">
				<ModalHeader>Detail Order</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<Table size={"sm"}>
						<Tbody>
							<Tr>
								<Td>ID:</Td>
								<Td>{orderRowData.id}</Td>
							</Tr>
							<Tr>
								<Td>Order at</Td>
								<Td>{orderRowData.ordered_at}</Td>
							</Tr>
							<Tr>
								<Td>Pharmacy</Td>
								<Td>{orderRowData.pharmacy_name}</Td>
							</Tr>
							<Tr>
								<Td>Customer</Td>
								<Td>{orderRowData.user_name}</Td>
							</Tr>
							<Tr>
								<Td>Address</Td>
								<Td>{orderRowData.address}</Td>
							</Tr>
							<Tr>
								<Td>Total items</Td>
								<Td>
									{orderRowData.n_items}
									{orderRowData.n_items === 1 ? " item" : " items"}
								</Td>
							</Tr>
							<Tr>
								<Td>Shipment Method</Td>
								<Td>{orderRowData.shipment_method_name}</Td>
							</Tr>
						</Tbody>
					</Table>
					{isLoading && (
						<Flex justifyContent={"center"}>
							<Spinner />
						</Flex>
					)}
					{!isLoading && (
						<Flex direction={"column"} rowGap={6}>
							<Text>Order Item:</Text>
							<Table size={"sm"}>
								<Thead>
									<Tr>
										<Th>No</Th>
										<Th>Name</Th>
										<Th>Amount</Th>
										<Th>Price</Th>
									</Tr>
								</Thead>
								<Tbody>
									{orderDetailRes?.data?.items?.map((i, idx) => {
										return (
											<Tr key={i.id}>
												<Td>{idx + 1}</Td>
												<Td>{i.product.name}</Td>
												<Td>{i.amount}</Td>
												<Td>{toRupiah(i.price)}</Td>
											</Tr>
										);
									})}
								</Tbody>
								<Tfoot>
									<Tr>
										<Td></Td>
										<Td></Td>
										<Td className="font-semibold">Subtotal</Td>
										<Td>{toRupiah(orderDetailRes?.data?.subtotal ?? 0)}</Td>
									</Tr>
									<Tr>
										<Td></Td>
										<Td></Td>
										<Td className="font-semibold">Shipment</Td>
										<Td>{toRupiah(orderDetailRes?.data?.shipment_fee ?? 0)}</Td>
									</Tr>
									<Tr>
										<Td></Td>
										<Td></Td>
										<Td className="font-semibold">Total</Td>
										<Td>{toRupiah(orderDetailRes?.data?.total ?? 0)}</Td>
									</Tr>
								</Tfoot>
							</Table>
						</Flex>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface DetailOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	access_token: string;
	orderRowData?: OrderRowData;
}

export default DetailOrderModal;
