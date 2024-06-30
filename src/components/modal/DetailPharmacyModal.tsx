import { PharmaciesRowData } from "@/types/table/pharmacy";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Flex,
	Text,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
} from "@chakra-ui/react";

const DetailPharmacyModal = ({
	isOpen,
	onClose,
	pharmacyRowData,
}: DetailPharmacyModalProps) => {
	return (
		<Modal size={"xl"} isOpen={isOpen} onClose={onClose} isCentered={true}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Detail Pharmacy</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<Table size={"sm"}>
						<Tbody>
							<Tr>
								<Td>Pharmacies ID</Td>
								<Td>{pharmacyRowData?.id}</Td>
							</Tr>
							<Tr>
								<Td>Name</Td>
								<Td>{pharmacyRowData?.name}</Td>
							</Tr>
							<Tr>
								<Td>Address</Td>
								<Td>{pharmacyRowData?.address}</Td>
							</Tr>
							<Tr>
								<Td>Pharmacist Name</Td>
								<Td>{pharmacyRowData?.pharmacist_name}</Td>
							</Tr>
							<Tr>
								<Td>Pharmacies License</Td>
								<Td>{pharmacyRowData?.pharmacist_license}</Td>
							</Tr>
							<Tr>
								<Td>Pharmacies Phone</Td>
								<Td>{pharmacyRowData?.pharmacist_phone}</Td>
							</Tr>
						</Tbody>
					</Table>
					<Flex direction={"column"} rowGap={2}>
						<Text>Shipment Methods:</Text>
						<Table size={"sm"}>
							<Tbody>
								{pharmacyRowData?.pharmacy_shipment_methods.map((o) => {
									return (
										<Tr key={o.id}>
											<Td>{o.shipment_method}</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</Flex>
					<Flex direction={"column"} rowGap={6}>
						<Text>Pharmacy Operations:</Text>
						<Table size={"sm"}>
							<Thead>
								<Tr>
									<Th>Day</Th>
									<Th>Start Time</Th>
									<Th>End Time</Th>
								</Tr>
							</Thead>
							<Tbody>
								{pharmacyRowData?.pharmacy_operations.map((o) => {
									return (
										<Tr key={o.id}>
											<Td>{o.day}</Td>
											<Td>{o.start_time}</Td>
											<Td>{o.end_time}</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface DetailPharmacyModalProps {
	isOpen: boolean;
	onClose: () => void;
	access_token: string;
	pharmacyRowData?: PharmaciesRowData;
}

export default DetailPharmacyModal;
