import { PageInfo } from "@/types/responses";
import { IconButton, Text } from "@chakra-ui/react";
import React from "react";

const Paginator = ({ pageInfo, onNext, onPrev }: PaginatorProps) => {
	if (!pageInfo) {
		return null;
	}

	return (
		<>
			<IconButton
				onClick={() => {
					if (pageInfo.current_page === 1) return;
					onPrev();
				}}
				aria-label="prev"
				colorScheme={pageInfo.current_page === 1 ? "gray" : "blue"}
				cursor={pageInfo.current_page === 1 ? "default" : "pointer"}
			>
				<i className="fa-solid fa-chevron-left"></i>
			</IconButton>
			<Text>{pageInfo.current_page}</Text>
			<IconButton
				onClick={() => {
					if (pageInfo.current_page >= pageInfo.page_count) return;
					onNext();
				}}
				aria-label="next"
				colorScheme={
					pageInfo.current_page >= pageInfo.page_count ? "gray" : "blue"
				}
				cursor={
					pageInfo.current_page >= pageInfo.page_count ? "default" : "pointer"
				}
			>
				<i className="fa-solid fa-chevron-right"></i>
			</IconButton>
		</>
	);
};

interface PaginatorProps {
	pageInfo?: PageInfo;
	onNext: () => void;
	onPrev: () => void;
}

export default Paginator;
