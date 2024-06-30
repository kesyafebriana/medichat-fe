import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import CreateUserLocationForm from "../form/CreateUserLocationForm";

const CreateUserLocationModal = ({
	isOpen,
	onClose,
}: CreateUserLocationModalProps) => {
	return (
		<Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered={true}>
			<ModalOverlay />
			<ModalContent className="">
				<ModalHeader>New Address</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<CreateUserLocationForm closeModal={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface CreateUserLocationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default CreateUserLocationModal;
