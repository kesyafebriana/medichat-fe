import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import CreateMutationForm from "../form/CreateMutationForm";

const CreateMutationModal = ({
	isOpen,
	onClose,
	mutate,
}: CreateMutationModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Stock Transfer</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<CreateMutationForm closeModal={onClose} mutate={mutate} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface CreateMutationModalProps {
	isOpen: boolean;
	onClose: () => void;
	mutate: () => void;
}

export default CreateMutationModal;
