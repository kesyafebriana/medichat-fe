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

const data = [
  {
    id: 1,
    name: "aku",
    image:
      "https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
    email: "akuaku@gmail.com",
    date_of_birth: "01 Februari 2001",
    location: [
      {
        latitude: "101341349",
        longitude: "13841324",
      },
      {
        latitude: "1012349",
        longitude: "234234535",
      },
    ],
  },
];

function getDataById(id: string) {
  return data.find((item) => item.id.toString() === id);
}

const Page = ({
  id,
  name,
  email,
  date_of_birth,
  image,
  location,
}: PageProps) => {
  return (
    <>
      <Header role="admin"/>
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
            >
              <Image src={image} alt={name} />
            </Box>
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
          Name
        </Text>
        <Text color={colors.secondaryText}>{name}</Text>
        <Stack mt={"15px"}>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Email
          </Text>
          <Text color={colors.secondaryText}>{email}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Date Of Birth
          </Text>
          <Text color={colors.secondaryText}>{date_of_birth}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Location
          </Text>
          {location.map((loc, i) => (
            <>
              <Text>{i+1}</Text>
              <Text color={colors.secondaryText}>Latitude: {loc.latitude}</Text>
              <Text color={colors.secondaryText}>
                Longitude: {loc.longitude}
              </Text>
            </>
          ))}
        </Stack>
        <Text />
      </Stack>
    </>
  );
};

interface PageProps {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  image: string;
  location: location[];
}

type location = {
  latitude: string;
  longitude: string;
};

Page.getInitialProps = async (ctx: NextPageContext) => {
  const id = ctx.query.id;
  const data = getDataById(id as string);
  return {
    id: id as string,
    name: data ? data.name : "Not Found",
    email: data ? data.email : "Not Found",
    date_of_birth: data ? data.date_of_birth : "Not Found",
    image: data ? data.image : "Not Found",
    location: data ? data.location : "Not Found",
  };
};

export default Page;
