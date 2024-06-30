import {
	Table as CTable,
	Flex,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import React, { FC } from "react";

export type TableColumn = {
	key: string;
	label: string;
};

export type TableData = {
	[key: string]: string | number | null | undefined;
};

export type TableProps = {
	columns: TableColumn[];
	data: TableData[];
	onClickRow?: (rowData: TableData) => void;
	actionColumn?: (rowData: TableData) => React.ReactNode;
};

const Table: FC<TableProps> = ({ columns, data, onClickRow, actionColumn }) => {
	return (
		<>
			<TableContainer
				border="1px solid rgba(122,122,122,.5)"
				borderRadius="10"
				overflowY="auto"
				overflowX="auto"
				maxW="100%"
			>
				<CTable
					variant="simple"
					fontSize="var(--chakra-fontSizes-md)"
					size={"lg"}
				>
					<Thead>
						<Tr>
							{columns.map((column) => (
								<Th
									position="sticky"
									top="0"
									backgroundColor="white"
									zIndex="2"
									key={column.key}
								>
									{column.label}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{data.map((row, rowIndex) => (
							<Tr
								key={rowIndex}
								className="hover:bg-slate-100 hover:cursor-pointer"
								onClick={() => {
									if (onClickRow) onClickRow(row);
								}}
							>
								{columns.map((column) => (
									<Td key={column.key}>
										{row[column.key] === null ? (
											<Text>-</Text>
										) : column.label === null ? (
											row["-"]
										) : (
											row[column.key]
										)}
									</Td>
								))}
								{actionColumn && <Td>{actionColumn(row)}</Td>}
							</Tr>
						))}
					</Tbody>
				</CTable>
			</TableContainer>
			{data.length === 0 && (
				<Flex justifyContent={"center"} height={"200px"} alignItems={"center"}>
					<Text>Data not found</Text>
				</Flex>
			)}
		</>
	);
};

export default Table;
