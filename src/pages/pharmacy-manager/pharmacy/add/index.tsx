import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { colors } from "@/constants/colors";
import Header from "@/components/ui/Header";

import SearchAdmin from "@/components/ui/SearchAdmin";
import TableAdmin from "@/components/ui/TableAdmin";
import { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { useRouter } from "next/router";

const columns: TableColumn[] = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "pharmacist_name", label: "Pharmacist Name" },
  { key: "", label: "" },
];

const data: TableData[] = [
  {
    id: 1,
    name: "Ini name",
    address: "Jln. Kenanga",
    city: "Bandung",
    pharmacist_name: "nama pharmacist",
  },
  {
    id: 2,
    name: "Ini name",
    address: "Jln. Kenanga",
    city: "Bandung",
    pharmacist_name: "nama pharmacist",
  },
  {
    id: 3,
    name: "Ini name",
    address: "Jln. Kenanga",
    city: "Bandung",
    pharmacist_name: "nama pharmacist",
  },
  {
    id: 4,
    name: "Ini name",
    address: "Jln. Kenanga",
    city: "Bandung",
    pharmacist_name: "nama pharmacist",
  },
];

const categories = [
  {
    id: 1,
    name: "Obat A",
    parent: null,
  },
  {
    id: 2,
    name: "Obat B",
    parent: null,
  },
  {
    id: 3,
    name: "Obat C",
    parent: null,
  },
  {
    id: 4,
    name: "Obat D",
    parent: null,
  },
  {
    id: 5,
    name: "Obat A.1",
    parent: 1,
  },
  {
    id: 6,
    name: "Obat A.2",
    parent: 1,
  },
  {
    id: 7,
    name: "Obat B.1",
    parent: 2,
  },
  {
    id: 8,
    name: "Obat C.1",
    parent: 3,
  },
];

export default function Page() {
  const router = useRouter();

  function handleButtonClick() {
    router.push("pharmacy/add");
  }

  function handleDetailButtonClick(rowData: TableData) {
    router.push(`pharmacy/${rowData.id}`);
  }

  return (
    <main>
      <Header  role=""/>
      <Container maxW="100vw" marginTop="25px">
        <SearchAdmin
          Title="Pharmacy"
          ButtonName="New Pharmacy"
          onButtonClick={handleButtonClick}
          For="add"
        />
      </Container>
      <Flex
        maxW="100vw"
        flexDirection="row"
        marginTop="25px"
        justifyContent="center"
      >
        <Container
          maxW="20vw"
          paddingRight="0"
          marginLeft="20px"
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          <Card
            width={"90%"}
            height={"auto"}
            className="shadow-2xl p-8"
            border="1px solid rgba(122,122,122,.5)"
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Category
            </Text>
            <Divider className="mt-4" color={`${colors.secondaryText}70`} />
            <Accordion allowToggle allowMultiple>
              <RadioGroup name="category">
                {categories.map(
                  (category) =>
                    category.parent === null && (
                      <AccordionItem key={category.id}>
                        <h2>
                          <AccordionButton>
                            <AccordionIcon />
                            <Box as="span" flex="1" textAlign="left">
                              {category.name}
                            </Box>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} pl={10}>
                          <Flex flexDirection={"column"}>
                            {categories.map(
                              (subcategory) =>
                                subcategory.parent === category.id && (
                                  <Radio
                                    size="sm"
                                    key={subcategory.id}
                                    value={subcategory.id.toString()}
                                  >
                                    {subcategory.name}
                                  </Radio>
                                )
                            )}
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    )
                )}
              </RadioGroup>
            </Accordion>
          </Card>
          <Card
            width={"90%"}
            height={"auto"}
            className="shadow-2xl p-8"
            border="1px solid rgba(122,122,122,.5)"
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Product Classification
            </Text>
            <Divider className="mt-4" color={`${colors.secondaryText}70`} />
            <RadioGroup name="productForm" defaultValue="all">
              <Stack>
                <Radio size="sm" value="all">
                  All
                </Radio>
                <Radio size="sm" value="obat_bebas">
                  Obat Bebas
                </Radio>
                <Radio size="sm" value="obat_keras">
                  Obat Keras
                </Radio>
                <Radio size="sm" value="obat_bebas_terbatas">
                  Obat Bebas Terbatas
                </Radio>
                <Radio size="sm" value="non_obat">
                  Non Obat
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
        </Container>
        <Container maxW="80vw" maxH="70vh" paddingLeft="0" marginRight="20px">
          <TableAdmin
            columns={columns}
            data={data}
            onDetailButtonClick={handleDetailButtonClick}
          />
        </Container>
      </Flex>
    </main>
  );
}
