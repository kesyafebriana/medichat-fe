import React from "react";
import {
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	Button,
} from "@chakra-ui/react";

const OrderAlert = ({
	setStatus,
	isOpen,
	cancelRef,
	onClose,
	onConfirm,
}: OrderAlertProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onConfirmAction = async () => {
		setIsLoading(true);
		await onConfirm();
		setIsLoading(false);
        onClose();
	};

	const color = setStatus === "cancel" ? "red" : "green"

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isCentered
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						Main Address
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure to {setStatus} the order?
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme={color}
							onClick={onConfirmAction}
							ml={3}
							isLoading={isLoading}
						>
							OK
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

interface OrderAlertProps {
	setStatus: string;
	isOpen: boolean;
	onClose: () => void;
	cancelRef: React.MutableRefObject<any>;
	onConfirm: () => void;
}

export default OrderAlert;
