import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import EditProfileForm from "../form/EditProfileForm";

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Profile</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<EditProfileForm closeModal={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default EditProfileModal;
