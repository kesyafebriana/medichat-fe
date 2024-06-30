import { colors } from "@/constants/colors";
import {
  Badge,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

interface doctorItf {
  id: number;
  isOnline: boolean;
  name: string;
  specialty: string;
  yearOfExperience: number;
  rating: number;
  price: string;
  photoUrl: string;
}

interface doctorDataItf {
  data: doctorItf;
}

function DoctorCard({ data }: doctorDataItf): React.ReactElement {
  return (
    <Link href={`doctors/${data.id}`}>
      <Card width={{ base: "full", lg: "580px" }} padding={"20px"}>
        <Flex width={"full"} gap={"20px"} alignItems={"center"}>
          <Image
            src={data.photoUrl}
            alt={data.name}
            width={{ base: "120px", lg: "180px" }}
            height={{ base: "120px", lg: "180px" }}
            objectFit={"contain"}
            border={`1px solid ${colors.secondaryText}50`}
            borderRadius={"10px"}
          />
          <Flex
            flexDirection={"column"}
            justifyContent={"space-between"}
            width={"full"}
            height={"full"}
            gap={{ base: "5px", lg: "0px" }}
          >
            <VStack alignItems={"start"} rowGap={{ lg: "8px" }}>
              <Badge
                color={data.isOnline ? colors.success : colors.secondaryText}
                bg={
                  data.isOnline
                    ? `${colors.success}20`
                    : `${colors.secondaryText}20`
                }
              >
                <i className="fa-solid fa-circle"></i>{" "}
                {data.isOnline ? "Online" : "Offline"}
              </Badge>
              <Text fontSize={{ lg: "18px" }} fontWeight={700}>
                {data.name}
              </Text>
              <Text color={colors.secondaryText}>{data.specialty}</Text>
              <HStack>
                <Badge
                  fontSize={"14px"}
                  color={colors.primary}
                  bg={`${colors.primary}20`}
                >
                  <i className="fa-solid fa-briefcase"></i>{" "}
                  {data.yearOfExperience}{" "}
                  {data.yearOfExperience > 1 ? "years" : "year"}
                </Badge>
                <Badge
                  fontSize={"14px"}
                  color={colors.primary}
                  bg={`${colors.primary}20`}
                >
                  <i className="fa-solid fa-thumbs-up"></i> {data.rating}%
                </Badge>
              </HStack>
            </VStack>
            <Flex
              justifyContent={"space-between"}
              alignItems={{ lg: "center" }}
              maxW={"full"}
              gap={{ base: "10px", lg: "0px" }}
              flexDirection={{ base: "column", lg: "row" }}
            >
              <Text fontWeight={600}>{data.price}</Text>
              {data.isOnline && <Button variant={"brandPrimary"}>Chat</Button>}
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}

export default DoctorCard;
