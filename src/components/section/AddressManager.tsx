import { colors } from "@/constants/colors";
import {
	Button,
	Card,
	Divider,
	Flex,
	IconButton,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import CreateUserLocationModal from "../modal/CreateUserLocationModal";
import { UserLocation } from "@/types/responses/profile";
import DeleteAlert from "../modal/DeleteAlert";
import {
	deleteAddressAction,
	updateMainLocationAction,
} from "@/redux/slice/locationSlice";
import useSession from "@/hooks/useSession";
import UpdateUserLocationModal from "../modal/UpdateUserLocationModal";
import UpdateMainLocationAlert from "../modal/UpdateMainLocationAlert";

const AddressManager = () => {
	return (
		<Card
			width={"full"}
			size={"2xl"}
			className="p-8"
			borderRadius={"8px"}
			color={`${colors.primaryText}90`}
		>
			<Flex flexDirection={"column"} gap={"20px"}>
				<Text color={colors.primaryText} fontSize={"20px"} fontWeight={600}>
					Manage Addresses
				</Text>
				<Divider />
				<AddressList />
				<CreateAddressSection />
			</Flex>
		</Card>
	);
};

const AddressList = () => {
	const locationState = useAppSelector((state) => state.location);
	const mainLocationIdx = locationState.locations.findIndex(
		(l) => l?.id === locationState?.main_location_id
	);

	const locationData = [
		locationState.locations[mainLocationIdx],
		...locationState.locations.filter(
			(l) => l?.id !== locationState?.main_location_id
		),
	];

	return (
		<Flex direction={"column"} rowGap={6}>
			{locationData.map((l) => (
				<AddressItem
					key={l?.id}
					location={l}
					isMainLocation={l?.id === locationState?.main_location_id}
				/>
			))}
		</Flex>
	);
};

const AddressItem = ({
	location,
	isMainLocation,
}: {
	location: UserLocation;
	isMainLocation: boolean;
}) => {
	const { session } = useSession();
	const dispatch = useAppDispatch();
	const toast = useToast();
	const {
		onClose: onCloseDeleteAlert,
		onOpen: onOpenDeleteAlert,
		isOpen: isOpenDeleteAlert,
	} = useDisclosure();

	const cancelRef = React.useRef();
	const {
		onClose: onCloseUpdateModal,
		onOpen: onOpenUpdateModal,
		isOpen: isOpenUpdateModal,
	} = useDisclosure();

	const {
		onClose: onCloseUpdateMainLocationAlert,
		onOpen: onOpenUpdateMainLocationAlert,
		isOpen: isOpenUpdateMainLocationAlert,
	} = useDisclosure();
	const cancelUpdateMainLocationRef = React.useRef();

	const onDeleteAddress = async () => {
		try {
			await dispatch(
				deleteAddressAction({
					id: location.id,
					token: session?.access_token ?? "",
				})
			).unwrap();
			onCloseDeleteAlert();
			toast({
				title: "address deleted.",
				description: "successfully deleted address.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			toast({
				title: "something went wrong",
				description: "failed delete address.",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const onUpdateMainLocation = async () => {
		try {
			await dispatch(
				updateMainLocationAction({
					id: location.id,
					token: session?.access_token ?? "",
				})
			).unwrap();
			onCloseUpdateMainLocationAlert();
			toast({
				title: "main address updated.",
				description: "successfully update main address.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e) {
			toast({
				title: "something went wrong",
				description: "failed update main address.",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	return (
		<>
			<Flex 
				alignItems={{ base: "start", lg: "center" }} 
				w={"full"} gap={"30px"}
				flexDirection={{ base: "column", lg: "row" }}
			>
				<Flex
					direction={"column"}
					rowGap={2}
					border={`1px solid ${colors.primaryText}20`}
					borderRadius={"8px"}
					padding={"20px"}
					className="flex-1"
				>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Text fontWeight={600} color={colors.primaryText}>
							{location?.alias}
						</Text>
						{isMainLocation && (
							<Text color={colors.primary} fontWeight={600}>
								Main Address
							</Text>
						)}
					</Flex>
					<Flex gap={"10px"}>
						<Text color={colors.primary}>
							<i className="fa-solid fa-location-dot"></i>
						</Text>
						<Text maxW={"70%"} color={colors.secondaryText}>
							{location?.address}
						</Text>
					</Flex>
				</Flex>
				<Flex columnGap={6} minWidth={"200px"}>
					<Tooltip label="delete address">
						<IconButton
							aria-label="delete address"
							isRound
							onClick={onOpenDeleteAlert}
						>
							<Text fontSize={"20px"} color={colors.danger} cursor={"pointer"}>
								<i className="fa-solid fa-trash"></i>
							</Text>
						</IconButton>
					</Tooltip>
					<Tooltip label="update address">
						<IconButton
							aria-label="update address"
							isRound
							onClick={onOpenUpdateModal}
						>
							<Text fontSize={"20px"} color={colors.primary} cursor={"pointer"}>
								<i className="fa-solid fa-pen"></i>
							</Text>
						</IconButton>
					</Tooltip>
					{!isMainLocation && (
						<Tooltip label="set as main address">
							<IconButton
								aria-label="set main address"
								isRound
								onClick={onOpenUpdateMainLocationAlert}
							>
								<Text
									fontSize={"20px"}
									color={colors.primary}
									cursor={"pointer"}
								>
									<i className="fa-solid fa-thumbtack"></i>
								</Text>
							</IconButton>
						</Tooltip>
					)}
				</Flex>
			</Flex>
			<UpdateMainLocationAlert
				addressAlias={location?.alias}
				isOpen={isOpenUpdateMainLocationAlert}
				onClose={onCloseUpdateMainLocationAlert}
				cancelRef={cancelUpdateMainLocationRef}
				onUpdate={onUpdateMainLocation}
			/>
			<UpdateUserLocationModal
				location={location}
				isMainLocation={isMainLocation}
				isOpen={isOpenUpdateModal}
				onClose={onCloseUpdateModal}
			/>
			<DeleteAlert
				isOpen={isOpenDeleteAlert}
				onClose={onCloseDeleteAlert}
				cancelRef={cancelRef}
				header="Delete address"
				onDelete={onDeleteAddress}
			/>
		</>
	);
};

const CreateAddressSection = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button variant={"brandPrimary"} onClick={onOpen} width={"170px"}>
				Add New Address
			</Button>
			<CreateUserLocationModal isOpen={isOpen} onClose={onClose} />;
		</>
	);
};

export default AddressManager;
