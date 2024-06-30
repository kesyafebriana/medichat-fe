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

const Alert = ({
	isOpen,
	cancelRef,
	onClose,
	header,
	onOK,
	children,
	okButtonColorScheme = "green",
}: AlertProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const onOKAction = async () => {
		setIsLoading(true);
		await onOK();
		setIsLoading(false);
		onClose();
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

					<AlertDialogBody>{children}</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme={okButtonColorScheme}
							onClick={onOKAction}
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

interface AlertProps extends React.PropsWithChildren {
	isOpen: boolean;
	onClose: () => void;
	cancelRef: React.MutableRefObject<any>;
	header: string;
	onOK: () => void;
	okButtonColorScheme?: string;
}

export default Alert;
