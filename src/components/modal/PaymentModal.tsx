import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import PaymentForm from "../form/PaymentForm";

const PaymentModal = ({ isOpen, onClose, invoiceNumber }: PaymentModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col gap-5">
          <PaymentForm closeModal={onClose} invoiceNumber={invoiceNumber} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
}

export default PaymentModal;
