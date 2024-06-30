import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import CreatePharmacyForm from "../form/CreatePharmacyForm";

const CreatePharmacyModal = ({
	isOpen,
	onClose,
	mutate,
}: CreatePharmacyModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create pharmacy</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<CreatePharmacyForm closeModal={onClose} mutate={mutate} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface CreatePharmacyModalProps {
	isOpen: boolean;
	onClose: () => void;
	mutate: () => void;
}

export default CreatePharmacyModal;
