import {
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	Button,
} from "@chakra-ui/react";
import React from "react";

const DeleteAlert = ({
	isOpen,
	cancelRef,
	onClose,
	header,
	onDelete,
}: DeleteAlertProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onDeleteAction = async () => {
		setIsLoading(true);
		await onDelete();
		setIsLoading(false);
	};

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
						{header}
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure? You can&apos;t undo this action afterwards.
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme="red"
							onClick={onDeleteAction}
							ml={3}
							isLoading={isLoading}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

interface DeleteAlertProps {
	isOpen: boolean;
	onClose: () => void;
	cancelRef: React.MutableRefObject<any>;
	header: string;
	onDelete: () => void;
}

export default DeleteAlert;
