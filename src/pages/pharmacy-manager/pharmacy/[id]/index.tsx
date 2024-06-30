import Header from "@/components/ui/Header";
import { NextPageContext } from "next";
import React from "react";
import { colors } from "@/constants/colors";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import TableAdmin, { TableColumn, TableData } from "@/components/ui/TableAdmin";
import router from "next/router";
import { convertToSlug } from "@/utils/convert";

const data = [
  {
    id: 1,
    name: "Ini name1",
    address: "Jln. Kenanga",
    city: "Bandung",
    latitude: "1.0384",
    longitude: "1.3424",
    pharmacist_name: "nama pharmacist",
    pharmacist_lisence: "nama pharmacist",
    pharmacist_phone: "nama pharmacist",
    operational_hour: "jam jaman",
    operational_day: "jam jaman",
    shipping_method: "same day",
  },
  {
    id: 2,
    name: "Ini name2",
    address: "Jln. Kenanga",
    city: "Bandung",
    latitude: "1.0384",
    longitude: "1.3424",
    pharmacist_name: "nama pharmacist",
    pharmacist_lisence: "nama pharmacist",
    pharmacist_phone: "nama pharmacist",
    operational_hour: "jam jaman",
    operational_day: "jam jaman",
    shipping_method: "same day",
  },
  {
    id: 3,
    name: "Ini name3",
    address: "Jln. Kenanga",
    city: "Bandung",
    latitude: "1.0384",
    longitude: "1.3424",
    pharmacist_name: "nama pharmacist",
    pharmacist_lisence: "nama pharmacist",
    pharmacist_phone: "nama pharmacist",
    operational_hour: "jam jaman",
    operational_day: "jam jaman",
    shipping_method: "same day",
  },
];

const dataProduct: TableData[] = [
  {
    id: 1,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 1,
  },
  {
    id: 2,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 1,
  },
  {
    id: 3,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 1,
  },
  {
    id: 4,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 1,
  },
  {
    id: 5,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 2,
  },
  {
    id: 6,
    name: "Ini name",
    generic_name: "Ini generic name",
    manufacture: "Ini manufacture",
    content: "Ini content",
    pharmacy_id: 2,
  },
];

const columns: TableColumn[] = [
  { key: "name", label: "Name" },
  { key: "generic_name", label: "Generic Name" },
  { key: "manufacture", label: "Manufacture" },
  { key: "content", label: "Content" },
  { key: "", label: "" },
];

function getDataById(id: string) {
  return data.find((item) => item.id.toString() === id);
}

const Page = ({
  name,
  address,
  city,
  latitude,
  longitude,
  pharmacist_name,
  pharmacist_lisence,
  pharmacist_phone,
  operational_hour,
  operational_day,
  shipping_method,
}: PageProps) => {
  const { id } = router.query;
  const dataProductByPharmacy = (pharmacyId: number) => {
    return dataProduct.filter((product) => product.pharmacy_id === pharmacyId);
  };
  const data = dataProductByPharmacy(parseInt(id as string));

  function onDetailButtonClick(rowData: TableData): void {
    if (typeof rowData.name === "string") {
      router.push({
        pathname: `${id}/${convertToSlug(rowData.name)}`,
      });
    }
  }

  return (
    <>
      <Header role="admin" />
      <HStack>
        <HStack
          width={"full"}
          height={"200px"}
          bg={colors.primary}
          className="py-12 lg:py-16 relative"
        >
          <Flex
            className="absolute lg:top-1/3 pt-20 lg:pt-0 px-8 lg:px-16"
            gap={"30px"}
            w={"full"}
            h={"300px"}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <Box
              bg={colors.white}
              width={{ base: "full", lg: "300px" }}
              height={{ base: "full", lg: "300px" }}
              objectFit={"contain"}
              className="shadow-lg"
              borderRadius={"8px"}
              maxW={{ lg: "20%" }}
            ></Box>
            <Flex
              flexDirection={"column"}
              justifyContent={"space-between"}
              w={"80%"}
              h={"300px"}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"space-around"}
                h={"250px"}
              >
                <Text
                  color={{ base: colors.primaryText, lg: colors.white }}
                  fontSize={{ base: "24px", lg: "32px" }}
                  fontWeight={600}
                >
                  {name}
                </Text>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                w={{ lg: "full" }}
                h={"full"}
                alignItems={"center"}
                flexDirection={{ base: "column", lg: "row" }}
                gap={{ base: "20px", lg: "0px" }}
              >
                <Flex
                  flexDirection={"column"}
                  w={{ lg: "400px" }}
                  h={"full"}
                  justifyContent={"space-around"}
                >
                  <Divider />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </HStack>
      </HStack>
      <Stack
        mt={{ base: "430px", lg: "200px" }}
        mb={{ lg: "50px" }}
        className="px-8 lg:px-16"
      >
        <Text color={colors.primary} fontSize={"28px"} fontWeight={600}>
          Address
        </Text>
        <Text color={colors.secondaryText}>{address}</Text>
        <Stack mt={"15px"}>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            City
          </Text>
          <Text color={colors.secondaryText}>{city}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Latitude
          </Text>
          <Text color={colors.secondaryText}>{latitude}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Longitude
          </Text>
          <Text color={colors.secondaryText}>{longitude}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Pharmacist Name
          </Text>
          <Text color={colors.secondaryText}>{pharmacist_name}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Pharmacist License Number
          </Text>
          <Text color={colors.secondaryText}>{pharmacist_lisence}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Pharmacist Phone Number
          </Text>
          <Text color={colors.secondaryText}>{pharmacist_phone}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Operational Hour
          </Text>
          <Text color={colors.secondaryText}>{operational_hour}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Operational Day
          </Text>
          <Text color={colors.secondaryText}>{operational_day}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Shipping Method
          </Text>
          <Text color={colors.secondaryText}>{shipping_method}</Text>
        </Stack>
        <Text
          marginTop={"50px"}
          fontWeight={600}
          fontSize={"18px"}
          color={colors.primaryText}
        >
          List Product
        </Text>
        <TableAdmin
          columns={columns}
          data={data}
          onDetailButtonClick={onDetailButtonClick}
        ></TableAdmin>
        <Text />
      </Stack>
    </>
  );
};

interface PageProps {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  pharmacist_name: string;
  pharmacist_lisence: string;
  pharmacist_phone: string;
  operational_hour: string;
  operational_day: string;
  shipping_method: string;
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const id = ctx.query.id;
  const data = getDataById(id as string);
  return {
    id: id as string,
    name: data ? data.name : "Not Found",
    address: data ? data.address : "Not Found",
    city: data ? data.city : "Not Found",
    latitude: data ? data.latitude : "Not Found",
    longitude: data ? data.longitude : "Not Found",
    pharmacist_name: data ? data.pharmacist_name : "Not Found",
    pharmacist_lisence: data ? data.pharmacist_lisence : "Not Found",
    pharmacist_phone: data ? data.pharmacist_phone : "Not Found",
    operational_hour: data ? data.operational_hour : "Not Found",
    operational_day: data ? data.operational_day : "Not Found",
    shipping_method: data ? data.shipping_method : "Not Found",
  };
};

export default Page;
