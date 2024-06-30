import { colors } from "@/constants/colors";
import Layout from "@/layouts/layout";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import Header from "@/components/ui/Header";

const dummyProduct = {
  id: 5,
  name: "Episan Suspensi 100ml",
  slug: "episan-suspensi-100ml-13",
  floorPrice: 10000,
  ceilingPrice: 30000,
  packaging: "botol",
  type: "Obat Bebas",
  description:
    "<b>Degirol 0,25 mg Tablet bermanfaat untuk mengobati sakit tenggorokan, sariawan, radang amandel, atau radang pada mulut dan gusi akibat infeksi bakteri dan jamur.</b><br /><br />Degirol 0,25 mg Tablet mengandung bahan aktif dequalinium chloride. Dequalinium chloride memiliki sifat antiseptik yang bekerja dengan cara membunuh bakteri dan jamur penyebab infeksi ringan pada mulut dan tenggorokan",
  image:
    "https://pimpharma.com/wp-content/uploads/2023/02/paracetamol-box-1.png",
};

const pharmacies = [
  {
    id: 1,
    price: 10000,
    name: "Pharmacy ABC",
    pharmacist_name: "apt. Muhammad Owen",
    pharmacist_license: "1590/SIPA/413.111/VII/2021",
    long: 106.8259614,
    lat: -6.2273384,
    distance: 2.5,
    pharmacy_address:
      "jl. Raya Lamongrejo ni. 123 RT. 01 RW. 03,kel.Sidokumpul, kec. Lamongan, Kab. lamongan. Kode pos 62213",
    schedule: [
      {
        day: "Monday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Tuesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Wednesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Thursday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Friday",
        start_time: "08.00",
        end_time: "17.00",
      },
    ],
  },
  {
    id: 2,
    price: 12000,
    name: "Pharmacy DEF",
    pharmacist_name: "apt. Muhammad Owen",
    pharmacist_license: "1590/SIPA/413.111/VII/2021",
    long: 106.8259614,
    lat: -6.2273384,
    distance: 2.5,
    pharmacy_address:
      "jl. Raya Lamongrejo ni. 123 RT. 01 RW. 03,kel.Sidokumpul, kec. Lamongan, Kab. lamongan. Kode pos 62213",
    schedule: [
      {
        day: "Monday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Tuesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Wednesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Thursday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Friday",
        start_time: "08.00",
        end_time: "17.00",
      },
    ],
  },
  {
    id: 3,
    price: 17000,
    name: "Pharmacy GHI",
    pharmacist_name: "apt. Muhammad Owen",
    pharmacist_license: "1590/SIPA/413.111/VII/2021",
    long: 106.8259614,
    lat: -6.2273384,
    distance: 2.5,
    pharmacy_address:
      "jl. Raya Lamongrejo ni. 123 RT. 01 RW. 03,kel.Sidokumpul, kec. Lamongan, Kab. lamongan. Kode pos 62213",
    schedule: [
      {
        day: "Monday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Tuesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Wednesday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Thursday",
        start_time: "08.00",
        end_time: "17.00",
      },
      {
        day: "Friday",
        start_time: "08.00",
        end_time: "17.00",
      },
    ],
  },
];

interface scheduleItf {
  day: string;
  start_time: string;
  end_time: string;
}

interface pharmacyItf {
  id: number;
  price: number;
  name: string;
  pharmacist_name: string;
  pharmacist_license: string;
  pharmacy_address: string;
  schedule: scheduleItf[];
}

export default function Page() {
  const {
    isOpen: isOpenPharmacyInfo,
    onOpen: onOpenPharmacyInfo,
    onClose: onClosePharmacyInfo,
  } = useDisclosure();
  const {
    isOpen: isOpenOtherPharmacy,
    onOpen: onOpenOtherPharmacy,
    onClose: onCloseOtherPharmacy,
  } = useDisclosure();
  const [pharmacy, setPharmacy] = useState<pharmacyItf>();
  const [selectedPharmacy, setSelectedPharmacy] = useState(2);
  const [isExpandable, setIsExpandable] = useState(false);

  useEffect(() => {
    const found = pharmacies.find(
      (pharmacy) => pharmacy.id === selectedPharmacy
    );

    if (found != undefined && found != null) {
      setPharmacy(found);
    }
  }, [selectedPharmacy]);

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
              <Image src={dummyProduct.image} alt={dummyProduct.name} />
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
                <Flex
                  maxW={"200px"}
                  h={"30px"}
                  borderRadius={"8px"}
                  bg={colors.white}
                >
                  <Flex
                    w="full"
                    h="full"
                    bg={`${colors.success}50`}
                    gap={"15px"}
                    alignItems={"center"}
                    fontWeight={600}
                    justifyContent={"center"}
                  >
                    <Box
                      w={"20px"}
                      h={"20px"}
                      bg={colors.success}
                      border={"1px solid black"}
                      className="rounded-full"
                    ></Box>
                    {dummyProduct.type}
                  </Flex>
                </Flex>
                <Text
                  color={{ base: colors.primaryText, lg: colors.white }}
                  fontSize={{ base: "24px", lg: "32px" }}
                  fontWeight={600}
                >
                  {dummyProduct.name}
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
                  <Box>
                    {pharmacy !== undefined ? (
                      <>
                        <Text
                          color={colors.secondaryText}
                          fontWeight={500}
                          fontSize={"24px"}
                        >
                          Rp {pharmacy.price}
                        </Text>
                      </>
                    ) : (
                      <SkeletonText
                        skeletonHeight="3"
                        noOfLines={1}
                        w={"170px"}
                      ></SkeletonText>
                    )}
                    <Text color={colors.secondaryText}>
                      per {dummyProduct.packaging}
                    </Text>
                  </Box>
                  <Divider />
                  <Box>
                    <HStack>
                      {pharmacy !== undefined ? (
                        <>
                          <Text
                            cursor={"pointer"}
                            color={colors.primary}
                            fontWeight={600}
                            onClick={onOpenPharmacyInfo}
                          >
                            {pharmacy.name}{" "}
                            <i className="fa-solid fa-circle-info"></i>
                          </Text>
                        </>
                      ) : (
                        <SkeletonText
                          skeletonHeight="3"
                          noOfLines={1}
                          w={"170px"}
                        ></SkeletonText>
                      )}

                      <Modal
                        isOpen={isOpenPharmacyInfo}
                        onClose={onClosePharmacyInfo}
                      >
                        <ModalOverlay />
                        <ModalContent maxW={"600px"}>
                          <ModalHeader>Pharmacy Information</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <Table>
                              <Tbody fontSize={"14px"}>
                                <Tr>
                                  <Td fontWeight={600}>Pharmacy Name</Td>
                                  <Td>{pharmacy?.name}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight={600}>Pharmacist</Td>
                                  <Td>{pharmacy?.pharmacist_name}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight={600}>SIPA Number</Td>
                                  <Td>{pharmacy?.pharmacist_license}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight={600}>Address</Td>
                                  <Td>{pharmacy?.pharmacy_address}</Td>
                                </Tr>
                                <Tr>
                                  <Td fontWeight={600}>Schedule</Td>
                                  <Td>
                                    <Table>
                                      <Tbody fontSize={"12px"}>
                                        {pharmacy?.schedule.map((day) => (
                                          <Tr key={day.day}>
                                            <Td>{day.day}</Td>
                                            <Td>
                                              {day.start_time} - {day.end_time}
                                            </Td>
                                          </Tr>
                                        ))}
                                      </Tbody>
                                    </Table>
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </HStack>
                  </Box>
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
          Description
        </Text>
        <Text color={colors.secondaryText}>
          {parse(dummyProduct.description)}
        </Text>
          <Stack mt={"15px"}>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Generic Name
            </Text>
            <Text color={colors.secondaryText}>Degirol</Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Content
            </Text>
            <Text color={colors.secondaryText}>
              Dequalinium chloride 0,25 mg
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Category
            </Text>
            <Text color={colors.secondaryText}>
              Category Level 1 {">"} Category Level 2
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Product Form
            </Text>
            <Text color={colors.secondaryText}>Tablet Isap</Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Product Classification
            </Text>
            <Text color={colors.secondaryText}>Obat Keras</Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Packaging
            </Text>
            <Text color={colors.secondaryText}>Strip @ 10 tablet isap</Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Manufacture
            </Text>
            <Text color={colors.secondaryText}>PT Darya Varia Laboratoria</Text>
          </Stack>
        <Text
          mt={"10px"}
          color={colors.primary}
          fontWeight={600}
          cursor={"pointer"}
          onClick={() => setIsExpandable(!isExpandable)}
        >
        </Text>
      </Stack>
      </>
  );
}
