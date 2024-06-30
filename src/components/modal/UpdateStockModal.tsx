import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import UpdateStockForm from "../form/UpdateStockForm";
import { StockJoinedRowData } from "@/types/table/stock";

const UpdateStockModal = ({
	isOpen,
	onClose,
	stock,
	mutate,
}: UpdateStockModalProps) => {
	if (!stock) return undefined;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Update stock</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<UpdateStockForm closeModal={onClose} stock={stock} mutate={mutate} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface UpdateStockModalProps {
	stock?: StockJoinedRowData;
	isOpen: boolean;
	onClose: () => void;
	mutate: () => void;
}

export default UpdateStockModal;
