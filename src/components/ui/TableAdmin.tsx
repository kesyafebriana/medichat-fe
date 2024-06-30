import {
	Button,
	Table,
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

export type TableAdminProps = {
  columns: TableColumn[];
  data: TableData[];
  onDetailButtonClick: (rowData: TableData) => void;
  buttonName?: string;
};

const TableAdmin: FC<TableAdminProps> = ({
  columns,
  data,
  onDetailButtonClick,
  buttonName,
}) => {
  return (
    <TableContainer
      border="1px solid rgba(122,122,122,.5)"
      borderRadius="10"
      overflowY="auto"
      overflowX="auto"
      maxW="100%"
    >
      <Table variant="simple" fontSize="var(--chakra-fontSizes-md)">
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
            <Tr key={rowIndex}>
              {columns.map((column) => (
                <Td key={column.key}>
                  {row[column.key] === null ? (
                    <Text>-</Text>
                  ) : column.key === "" ? (
                    <Button
                      width="auto"
                      backgroundColor="#1053D4"
                      color="white"
                      fontWeight="600"
                      onClick={() => onDetailButtonClick(row)}
                      _hover={{ bg: "#0057FF" }}
                    >
                      { buttonName ? buttonName : "Detail"}
                    </Button>
                  ) : column.label === null ? (
                    row["-"]
                  ) : (
                    row[column.key]
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableAdmin;
