import { PharmaciesRowData } from "@/types/table/pharmacy";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import UpdatePharmacyForm from "../form/UpdatePharmacyForm";

const UpdatePharmacyModal = ({
	isOpen,
	onClose,
	pharmacy,
	mutate,
}: UpdatePharmacyModalProps) => {
	if (!pharmacy) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Update pharmacy</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<UpdatePharmacyForm
						pharmacy={pharmacy}
						closeModal={onClose}
						mutate={mutate}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface UpdatePharmacyModalProps {
	isOpen: boolean;
	onClose: () => void;
	mutate: () => void;
	pharmacy?: PharmaciesRowData;
}

export default UpdatePharmacyModal;
