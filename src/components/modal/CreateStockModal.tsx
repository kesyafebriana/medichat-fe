import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import CreateStockForm from "../form/CreateStockForm";

const CreateStockModal = ({
	isOpen,
	onClose,
	mutate,
}: CreateStockModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create stock</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<CreateStockForm closeModal={onClose} mutate={mutate} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface CreateStockModalProps {
	isOpen: boolean;
	onClose: () => void;
	mutate: () => void;
}

export default CreateStockModal;
