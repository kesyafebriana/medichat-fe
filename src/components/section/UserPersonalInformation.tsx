import { colors } from "@/constants/colors";
import {
	Avatar,
	Button,
	Card,
	Divider,
	Flex,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "@/redux/reduxHook";
import EditProfileModal from "../modal/EditProfileModal";

const UserPersonalInformation = () => {
	const profileState = useAppSelector((state) => state.profile);
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Card
			width={"full"}
			size={"2xl"}
			className="p-8"
			borderRadius={"8px"}
			color={`${colors.primaryText}90`}
		>
			<Flex flexDirection={"column"} gap={"15px"}>
				<Text color={colors.primaryText} fontSize={"20px"} fontWeight={600}>
					My Profile
				</Text>
				<Divider />
				<Flex justifyContent={"center"}>
					<Avatar
						width={"150px"}
						height={"150px"}
						src={profileState.photo_url}
						referrerPolicy="no-referrer"
					/>
				</Flex>
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Fullname</Text>
					<Text>{profileState.name}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Date of Birth</Text>
					<Text>{profileState.date_of_birth}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Email</Text>
					<Text>{profileState.email}</Text>
				</Flex>
				<Button variant={"brandPrimary"} onClick={onOpen}>
					Edit
				</Button>
				<EditProfileModal isOpen={isOpen} onClose={onClose} />
			</Flex>
		</Card>
	);
};

export default UserPersonalInformation;
