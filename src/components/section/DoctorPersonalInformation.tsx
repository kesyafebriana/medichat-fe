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
import Link from "next/link";
import UpdateDoctorProfileModal from "../modal/UpdateDoctorProfileModal";
import { toRupiah } from "@/utils/convert";

const DoctorPersonalInformation = () => {
	const doctorProfileState = useAppSelector((state) => state.doctorProfile);
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
						src={doctorProfileState.photo_url}
						referrerPolicy="no-referrer"
					/>
				</Flex>
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Fullname</Text>
					<Text>{doctorProfileState.name}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Gender</Text>
					<Text>{doctorProfileState.gender}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Specialization</Text>
					<Text>{doctorProfileState.specialization.name}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>STR</Text>
					<Text>{doctorProfileState.str}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Work Location</Text>
					<Text>{doctorProfileState.work_location}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Year Experience</Text>
					<Text>
						{doctorProfileState.year_experience}{" "}
						{doctorProfileState.year_experience <= 1 ? "year" : "years"}
					</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Price</Text>
					<Text>{toRupiah(doctorProfileState.price)}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Email</Text>
					<Text>{doctorProfileState.email}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Phone number</Text>
					<Text>+62{doctorProfileState.phone_number}</Text>
				</Flex>
				<Divider />
				<Flex justifyContent={"space-between"}>
					<Text color={colors.primaryText}>Certificate</Text>
					<Link href={doctorProfileState.certification_url}>
						<Text as={"u"}>open</Text>
					</Link>
				</Flex>
				<Divider />
				<Button variant={"brandPrimary"} onClick={onOpen}>
					Edit
				</Button>
				<UpdateDoctorProfileModal onClose={onClose} isOpen={isOpen} />
			</Flex>
		</Card>
	);
};

export default DoctorPersonalInformation;
