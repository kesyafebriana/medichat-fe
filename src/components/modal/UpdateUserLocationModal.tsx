import React from "react";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import UpdateUserLocationForm from "../form/UpdateUserLocationForm";
import { UserLocation } from "@/types/responses/profile";

const UpdateUserLocationModal = ({
	location,
	isMainLocation,
	isOpen,
	onClose,
}: UpdateUserLocationModalProps) => {
	return (
		<Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered={true}>
			<ModalOverlay />
			<ModalContent className="">
				<ModalHeader>Update Address</ModalHeader>
				<ModalCloseButton />
				<ModalBody className="flex flex-col gap-5">
					<UpdateUserLocationForm
						closeModal={onClose}
						location={location}
						isMainLocation={isMainLocation}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

interface UpdateUserLocationModalProps {
	isOpen: boolean;
	location: UserLocation;
	isMainLocation: boolean;
	onClose: () => void;
}

export default UpdateUserLocationModal;
