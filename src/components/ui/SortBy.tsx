import React, { ChangeEvent, FC, useState } from "react";
import { Select, Stack, Text } from "@chakra-ui/react";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

interface SortOptions {
  key: string;
  label: string;
}

interface SortProps {
  options: SortOptions[];
  defaultSortOption: SortOptions;
  onSortChange: (sortOption: string, sortOrder: SortOrder) => void;
}

const Sort: FC<SortProps> = ({
  options,
  defaultSortOption,
  onSortChange,
}) => {
  const [sortOption, setSortOption] = useState(defaultSortOption);
  const [sortOrder, setSortOrder] = useState(SortOrder.ASC);

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOptionKey = event.target.value;
    const selectedSortOption = options.find((option) => option.key === selectedSortOptionKey);
    if (selectedSortOption) {
      setSortOption(selectedSortOption);
      onSortChange(selectedSortOption.key, sortOrder);
    }
  };

  const handleOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSortOrder = event.target.value as SortOrder;
    setSortOrder(selectedSortOrder);
    onSortChange(sortOption.key, selectedSortOrder);
  };

  return (
    <Stack marginBottom={"25px"} width={"50%"} direction="row" spacing={4} alignItems="center">
      <Text width={"30%"}>Sort by:</Text>
      <Select value={sortOption.key} onChange={handleSortChange}>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </Select>
      <Text width={"30%"}>Order:</Text>
      <Select value={sortOrder} onChange={handleOrderChange}>
        <option key={SortOrder.ASC} value={SortOrder.ASC}>
          Ascending
        </option>
        <option key={SortOrder.DESC} value={SortOrder.DESC}>
          Descending
        </option>
      </Select>
    </Stack>
  );
};

export default Sort;
