import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import UpdateDoctorProfileForm from "../form/UpdateDoctorProfileForm";

const UpdateDoctorProfileModal = ({
	isOpen,
	onClose,
}: UpdateDoctorProfileModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Profile</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<UpdateDoctorProfileForm closeModal={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface UpdateDoctorProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default UpdateDoctorProfileModal;
