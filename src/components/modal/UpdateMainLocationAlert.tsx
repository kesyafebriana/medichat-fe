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

const UpdateMainLocationAlert = ({
	addressAlias,
	isOpen,
	cancelRef,
	onClose,
	onUpdate,
}: UpdateMainLocationAlertProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onUpdateAction = async () => {
		setIsLoading(true);
		await onUpdate();
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
						Main Address
					</AlertDialogHeader>

					<AlertDialogBody>
						Are you sure to make &quot;{addressAlias}&quot; as your main address?
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme="green"
							onClick={onUpdateAction}
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

interface UpdateMainLocationAlertProps {
	addressAlias: string;
	isOpen: boolean;
	onClose: () => void;
	cancelRef: React.MutableRefObject<any>;
	onUpdate: () => void;
}

export default UpdateMainLocationAlert;
