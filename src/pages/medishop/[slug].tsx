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
import React, { useState } from "react";
import {
  ProductWithDetails,
  defaultProductWithDetails,
} from "@/types/responses/product";
import { GetServerSideProps } from "next";
import { SessionData, defaultSession } from "@/utils/session";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import {
  GetUserProfile,
  defaultGetUserProfile,
} from "@/types/responses/profile";
import { getUserProfile } from "@/services/profile";
import { unsealData } from "iron-session";
import { InferGetServerSidePropsType } from "next";
import { getProductBySlug } from "@/services/product";
import { getPharmaciesByProductSlug } from "@/services/pharmacy";
import {
  PharmacyPaginatedResponse,
  PharmacyResponse,
  defaultPharmacyPaginatedResponse,
} from "@/types/responses/pharmacy";
import { useAppDispatch } from "@/redux/reduxHook";
import { addOrder } from "@/redux/slice/cartSlice";
import { useRouter } from "next/router";
import { Unauthorized } from "@/exceptions/unauthorized";
import { handleServerSideError } from "@/utils/exception";
import prepareServerSide from "@/utils/prepareServerSide";

export default function Page({
  session,
  userProfile,
  slug,
  product,
  pharmacies: ph,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const pharmacies = ph.pharmacies ?? [];
  const [selectedPharmacy, setSelectedPharmacy] = useState<
    PharmacyResponse | undefined
  >(() => (pharmacies && pharmacies.length > 0 ? pharmacies[0] : undefined));
  const [isExpandable, setIsExpandable] = useState(false);

  const isAvailable = pharmacies.length > 0;

  const dispatch = useAppDispatch();

  const router = useRouter();

  function handleAddButtonClick() {
    dispatch(addOrder({
      account_id: userProfile.id,
      user_id: userProfile.user.id,
      product_slug: product.slug,
      pharmacy_slug: selectedPharmacy?.slug ?? "",
    }));
    router.push("/cart");
  }

  return (
    <Layout>
      <Flex
				alignItems={"center"}
				bg={colors.primary}
				w={"full"}
				className="px-8 lg:px-16 pt-8 lg:pt-16"
			>
				<Flex gap={"30px"}>
					<Text color={colors.white} fontSize={"32px"} fontWeight={600} onClick={router.back} className="hover:cursor-pointer">
						<i className="fa-solid fa-chevron-left"></i>
					</Text>
					<Text color={colors.white} fontSize={"32px"} fontWeight={600}>
						Product Detail
					</Text>
				</Flex>
			</Flex>
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
              width={{ base: "200px", lg: "300px" }}
              height={{ base: "200px", lg: "300px" }}
              aspectRatio={1}
              objectFit={"contain"}
              className="shadow-lg"
              borderRadius={"8px"}
            >
              <Image src={product.photo_url} alt={product.name} />
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
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Flex
                    w="full"
                    h="full"
                    bg={product.product_detail.product_classification === "Obat Keras" ? `${colors.danger}50` : product.product_detail.product_classification === "Obat Bebas Terbatas" ? `${colors.warning}50` : product.product_detail.product_classification === "Non Obat" ? `${colors.secondary}50` : `${colors.success}50`}
                    gap={"15px"}
                    alignItems={"center"}
                    fontWeight={600}
                    justifyContent={"center"}
                  >
                    <Box
                      w={"20px"}
                      h={"20px"}
                      bg={product.product_detail.product_classification === "Obat Keras" ? colors.danger : product.product_detail.product_classification === "Obat Bebas Terbatas" ? colors.warning : product.product_detail.product_classification === "Non Obat" ? colors.primary : colors.success}
                      border={"1px solid black"}
                      className="rounded-full"
                    ></Box>
                    {product.product_detail.product_classification}
                  </Flex>
                </Flex>
                <Text
                  color={{ base: colors.primaryText, lg: colors.white }}
                  fontSize={{ base: "24px", lg: "32px" }}
                  fontWeight={600}
                >
                  {product.name}
                </Text>
              </Flex>
              {isAvailable ? (
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
                    w={{ lg: "600px" }}
                    h={"full"}
                    justifyContent={"space-around"}
                  >
                    <Box>
                      {selectedPharmacy !== undefined ? (
                        <>
                          <Text
                            color={colors.secondaryText}
                            fontWeight={500}
                            fontSize={"24px"}
                          >
                            Rp{" "}
                            {(
                              selectedPharmacy.stock?.price ?? 0
                            ).toLocaleString()}
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
                        {product.product_detail.selling_unit}
                      </Text>
                    </Box>
                    <Divider />
                    <Box>
                      <HStack>
                        <Text>Shipped from</Text>
                        {selectedPharmacy !== undefined ? (
                          <>
                            <Text
                              cursor={"pointer"}
                              color={colors.primary}
                              fontWeight={600}
                              onClick={onOpenPharmacyInfo}
                            >
                              {selectedPharmacy.name}{" "}
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
                                    <Td>{selectedPharmacy?.name}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td fontWeight={600}>Pharmacist</Td>
                                    <Td>{selectedPharmacy?.pharmacist_name}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td fontWeight={600}>SIPA Number</Td>
                                    <Td>
                                      {selectedPharmacy?.pharmacist_license}
                                    </Td>
                                  </Tr>
                                  <Tr>
                                    <Td fontWeight={600}>Address</Td>
                                    <Td>{selectedPharmacy?.address}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td fontWeight={600}>Schedule</Td>
                                    <Td>
                                      <Table>
                                        <Tbody fontSize={"12px"}>
                                          {selectedPharmacy?.pharmacy_operations?.map(
                                            (op) => (
                                              <Tr key={op.day}>
                                                <Td>{op.day}</Td>
                                                <Td>
                                                  {op.start_time} -{" "}
                                                  {op.end_time}
                                                </Td>
                                              </Tr>
                                            )
                                          )}
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
                      <Text
                        color={colors.primary}
                        fontSize={"14px"}
                        onClick={onOpenOtherPharmacy}
                        cursor={"pointer"}
                        className="hover:underline hover:underline-offset-4"
                      >
                        Other Pharmacy Options{" "}
                        <i className="fa-solid fa-chevron-right"></i>
                      </Text>
                      <Modal
                        isOpen={isOpenOtherPharmacy}
                        onClose={onCloseOtherPharmacy}
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Choose Pharmacy</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody className="flex flex-col gap-3">
                            {pharmacies.map((store, index) => (
                              <Card shadow={"2xl"} key={store.id}>
                                <CardHeader fontWeight={600}>
                                  <VStack alignItems={"start"}>
                                    <HStack>
                                      {store.id === selectedPharmacy?.id && (
                                        <Badge
                                          bg={colors.success}
                                          color={colors.white}
                                        >
                                          <i className="fa-solid fa-circle-check"></i>{" "}
                                          Selected
                                        </Badge>
                                      )}
                                      {index == 0 && (
                                        <Badge
                                          bg={colors.warning}
                                          color={colors.white}
                                        >
                                          <i className="fa-solid fa-star"></i>{" "}
                                          Recommended
                                        </Badge>
                                      )}
                                    </HStack>
                                    <Text>
                                      <i className="fa-solid fa-shop"></i>{" "}
                                      {store.name}
                                    </Text>
                                  </VStack>
                                </CardHeader>
                                <CardBody>
                                  <Flex gap={"15px"}>
                                    <i className="fa-solid fa-location-dot"></i>
                                    <VStack alignItems={"start"}>
                                      <Text>{store.address}</Text>
                                      <Link
                                        target="_blank"
                                        href={`https://www.google.com/maps/search/?api=1&query=${store.coordinate.lat},${store.coordinate.lon}`}
                                      >
                                        <Text
                                          fontWeight={600}
                                          color={colors.primary}
                                        >
                                          Open Map
                                        </Text>
                                      </Link>
                                      <Text
                                        color={colors.secondaryText}
                                        fontSize={"14px"}
                                      >
                                        {((store.distance ?? 0) / 1000).toFixed(1)} km from your location
                                      </Text>
                                      <Text
                                        color={colors.secondaryText}
                                        fontSize={"14px"}
                                      >
                                        Pengiriman{" "}
                                        {store.pharmacy_shipment_methods
                                          ?.map((sp) => sp.shipment_method)
                                          .join(", ")}
                                      </Text>
                                      <Flex
                                        justifyContent={"space-between"}
                                        flexDirection={{
                                          base: "column",
                                          lg: "row",
                                        }}
                                        w={"full"}
                                        mt={"20px"}
                                        gap={{ base: "15px" }}
                                      >
                                        <Text
                                          fontSize={{
                                            base: "16px",
                                            lg: "20px",
                                          }}
                                        >
                                          <Text
                                            fontSize={"12px"}
                                            fontWeight={600}
                                          >
                                            Price
                                          </Text>
                                          Rp{" "}
                                          {(
                                            store.stock?.price ?? 0
                                          ).toLocaleString()}
                                        </Text>
                                        {store.id !== selectedPharmacy?.id && (
                                          <Button
                                            variant={"brandPrimary"}
                                            onClick={() =>
                                              setSelectedPharmacy(store)
                                            }
                                          >
                                            Choose Pharmacy
                                          </Button>
                                        )}
                                      </Flex>
                                    </VStack>
                                  </Flex>
                                </CardBody>
                              </Card>
                            ))}
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </Box>
                  </Flex>
                  <Button
                    variant={"brandPrimary"}
                    bg={colors.primary}
                    color={colors.white}
                    w={"250px"}
                    onClick={handleAddButtonClick}
                  >
                    + Add
                  </Button>
                </Flex>
              ) : (
                <Flex
                  flexDirection={"column"}
                  w={{ lg: "400px" }}
                  h={"full"}
                  gap={"24px"}
                  justifyContent={"center"}
                >
                  <Text fontWeight={600} fontSize={"20px"}>
                    Not Available
                  </Text>
                  <Text color={colors.secondaryText}>
                    Product is not available in your area.
                  </Text>
                </Flex>
              )}
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
          {parse(product.product_detail.description)}
        </Text>
        {isExpandable && (
          <Stack mt={"15px"}>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Generic Name
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.generic_name}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Content
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.content}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Category
            </Text>
            <Text color={colors.secondaryText}>
              {product.category.parent_name
                ? `${product.category.parent_name} > ${product.category.name}`
                : product.category.name}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Product Form
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.product_form}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Product Classification
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.product_classification}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Packaging
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.selling_unit}
            </Text>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Manufacturer
            </Text>
            <Text color={colors.secondaryText}>
              {product.product_detail.manufacturer}
            </Text>
          </Stack>
        )}
        <Text
          mt={"10px"}
          color={colors.primary}
          fontWeight={600}
          cursor={"pointer"}
          onClick={() => setIsExpandable(!isExpandable)}
        >
          {isExpandable ? "See Less" : "See More"}
        </Text>
      </Stack>
    </Layout>
  );
}

interface PageParams {
  slug: string;
}

type ServerSideProps = {
  session: SessionData;
  userProfile: GetUserProfile;
  slug: string;
  product: ProductWithDetails;
  pharmacies: PharmacyPaginatedResponse;
};

export const getServerSideProps = prepareServerSide((async (context) => {
  const slug = context.query.slug as string;

  try {
    const cookie = context.req.headers.cookie;

    const cSession = cookie
      ?.split("; ")
      .find((s) => s.startsWith(`${process.env.COOKIE_NAME}=`))
      ?.split("=")[1];

    if (!cSession) {
      throw new CookieNotFound();
    }

    const sessionData = await unsealData<SessionData>(cSession!!, {
      password: process.env.SESSION_SECRET as string,
    });

    const userProfileRes = await getUserProfile(sessionData.access_token);
    const userProfile = userProfileRes?.data ?? defaultGetUserProfile;

    const product = await getProductBySlug(slug, sessionData.access_token);

    const coordinate = userProfile.user.locations.find(
      (loc) => loc.id == userProfile.user.main_location_id
    )?.coordinate ?? { lat: 0, lon: 0 };

    const pharmacies = await getPharmaciesByProductSlug(
      slug,
      coordinate.lon,
      coordinate.lat
    );

    return {
      props: {
        session: sessionData,
        userProfile,
        slug,
        product: product?.data ?? defaultProductWithDetails,
        pharmacies: pharmacies?.data ?? defaultPharmacyPaginatedResponse,
      },
    };
  } catch (e) {
    throw e;
  }
}) satisfies GetServerSideProps<ServerSideProps>);
