import { Button, Flex, Input } from "@chakra-ui/react";
import React from "react";

const Searcher = ({ onSearch }: SearcherProps) => {
	const searchInputRef = React.useRef<HTMLInputElement>(null);

	return (
		<Flex alignItems={"center"} columnGap={4}>
			<Input
				size={"lg"}
				ref={searchInputRef}
				onKeyDownCapture={(e) => {
					if (e.key === "Enter" && searchInputRef.current?.value !== "") {
						onSearch(searchInputRef.current?.value ?? "");
					}
				}}
			/>
			<Button
				variant={"brandPrimary"}
				size={"lg"}
				onClick={() => {
					if (searchInputRef.current?.value !== "") {
						onSearch(searchInputRef.current?.value ?? "");
					}
				}}
			>
				Search
			</Button>
		</Flex>
	);
};

interface SearcherProps {
	onSearch: (term: string) => void;
}

export default Searcher;
