import Header from "@/components/ui/Header";
import SearchAdmin from "@/components/ui/SearchAdmin";
import TableAdmin, { TableColumn, TableData } from "@/components/ui/TableAdmin";
import {
  Card,
  Container,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const columns: TableColumn[] = [
  { key: "order_id", label: "Order ID" },
  { key: "order_date", label: "Order Date" },
  { key: "order_status", label: "Order Status" },
  { key: "user_fullname", label: "User's Fullname" },
  { key: "payment_method", label: "Payment Method" },
  { key: "number_of_items", label: "Number of Items" },
  { key: "total_payment", label: "Total Payment" },
  { key: "", label: "" },
];
const data: TableData[] = [
  {
    id: 1,
    order_id: "Ini name",
    order_date: "Ini generic name",
    order_status: "Ini manufacture",
    user_fullname: "Ini content",
    payment_method: "aa",
    number_of_items: 2,
    total_payment: 20000,
  },
];

const handleButtonClick = () => {};

const index = () => {
  return (
    <main>
      <Header role="admin"/>
      <Container maxW="100vw" marginTop="25px">
        <SearchAdmin
          Title="Order"
          ButtonName="New Category"
          onButtonClick={handleButtonClick}
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
              Pharmacy
            </Text>
            <Divider className="mt-4" color={"#333"} />
            <RadioGroup name="productForm" defaultValue="all">
              <Stack>
                <Radio size="sm" value="all">
                  All
                </Radio>
                <Radio size="sm" value="obat_bebas">
                  Pharmacy A
                </Radio>
                <Radio size="sm" value="obat_keras">
                  Pharmacy B
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
          <Card
            width={"90%"}
            height={"auto"}
            className="shadow-2xl p-8"
            border="1px solid rgba(122,122,122,.5)"
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Order Status
            </Text>
            <Divider className="mt-4" color={"#333"} />
            <RadioGroup name="productForm" defaultValue="all">
              <Stack>
                <Radio size="sm" value="all">
                  All
                </Radio>
                <Radio size="sm" value="obat_bebas">
                  Waiting for payment
                </Radio>
                <Radio size="sm" value="obat_keras">
                  Waiting for
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
        </Container>
        <Container maxW="80vw" maxH="70vh" paddingLeft="0" marginRight="20px">
          <TableAdmin
            columns={columns}
            data={data}
            onDetailButtonClick={function (rowData: TableData): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Container>
      </Flex>
    </main>
  );
};

export default index;
