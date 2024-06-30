import {
	Button,
	Container,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { colors } from "@/constants/colors";

interface SearchAdminProps {
	Title: string;
	ButtonName?: string;
	onButtonClick?: () => void;
	For?: "add";
	onSearch?: (searchTerm: string) => void;
	noSearch?: boolean;
}

const SearchAdmin: FC<SearchAdminProps> = ({
	Title,
	ButtonName,
	onButtonClick,
	For,
	onSearch,
	noSearch,
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = () => {
		if (onSearch) {
			onSearch(searchTerm);
		}
	};

	return (
		<Flex alignItems="center" w={"full"} justifyContent={"space-between"}>
			<Text
				fontSize="30px"
				width="230px"
				fontWeight="500"
				color={colors.primary}
				textAlign="center"
			>
				{Title}
			</Text>
		<Stack width="100%" spacing={4} flex="1">
		{
			!noSearch && 
			<InputGroup>
				<InputLeftElement pointerEvents="none">
					<SearchIcon color="gray.300" />
				</InputLeftElement>
				<Input
					placeholder={"Search " + Title + "..."}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSearch();
						}
					}}
				/>
				<InputRightElement width={"100px"}>
					<Button
						size="sm"
						bgColor={colors.primary}
						onClick={handleSearch}
						color={"white"}
						_hover={{ bg: "#0057FF" }}
					>
						Search
					</Button>
				</InputRightElement>
			</InputGroup>
				}
		</Stack>
			<Container maxW="230px" centerContent>
				{For === "add" && onButtonClick !== undefined ? (
					<Button
						leftIcon={<AddIcon />}
						bg={colors.primary}
						color="white"
						variant="solid"
						_hover={{ bg: "#0057FF" }}
						onClick={onButtonClick}
						maxW={"150px"}
					>
						{ButtonName}
					</Button>
				) : (<></>
				)}
			</Container>
		</Flex>
	);
};

export default SearchAdmin;
