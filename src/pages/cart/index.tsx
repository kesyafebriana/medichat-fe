import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Image as Img,
  Text,
  useDisclosure,
  Input,
  Tag,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../../public/assets/svg/logo.svg";
import { colors } from "@/constants/colors";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LogoOnly from "../../../public/assets/img/logo-only.png";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { getUserProfile } from "@/services/profile";
import { APIResponse } from "@/types/responses";
import {
  GetUserProfile,
  UserLocation,
  defaultGetUserProfile,
  defaultUserLocation,
} from "@/types/responses/profile";
import { SessionData, defaultSession } from "@/utils/session";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { OrdersRequest } from "@/types/requests/order";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import { OrdersResponse, defaultOrdersResponse } from "@/types/responses/order";
import {
  UserOrders,
  decrementProductOrder,
  deleteProductOrder,
  incrementProductOrder,
  resetCart,
  setDeliveryLocationID,
  setOrderShipmentMethod,
  updateCartSummary,
} from "@/redux/slice/cartSlice";
import { useRouter } from "next/router";
import { createOrder } from "@/services/order";
import prepareServerSide from "@/utils/prepareServerSide";
import { toRupiah } from "@/utils/convert";

const couriers = [
  {
    id: 1,
    name: "Official Instant",
    image: LogoOnly,
  },
  {
    id: 2,
    name: "Official Sameday",
    image: LogoOnly,
  },
];

function cartToOrderRequest(
  cart: UserOrders,
  location: UserLocation
): OrdersRequest {
  return {
    orders: cart.order.map((order) => ({
      pharmacy_slug: order.pharmacy_slug,
      shipment_method_id: order.shipment_method_id,
      address: location.address,
      coordinate: location.coordinate,
      items: order.items.map((item) => ({
        product_slug: item.slug,
        amount: item.amount,
      })),
    })),
  };
}

function summarizeCart(
  cart: UserOrders,
  cartDetail: OrdersResponse
): {
  n_items: number;
  subtotal: number;
  shipment_fee: number;
  total: number;
} {
  let n_items = 0;
  let subtotal = 0;
  let shipment_fee = 0;
  let total = 0;

  cartDetail.orders.forEach((order, orderIdx) => {
    if (orderIdx >= cart.order.length) return;

    shipment_fee += order.shipment_fee;
    total += order.shipment_fee;

    order.items?.forEach((item, itemIdx) => {
      if (itemIdx >= cart.order[orderIdx].items.length) return;

      const amount = cart.order[orderIdx].items[itemIdx].amount;

      n_items += amount;
      subtotal += amount * item.price;
      total += amount * item.price;
    });
  });

  return {
    n_items,
    subtotal,
    shipment_fee,
    total,
  };
}

function Page({
  session,
  userProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const carts = useAppSelector((s) => s.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [errorPrescription, setErrorPrescription] = useState(true);

  const [needMutate, notifyMutate] = useState<{}>({});  

  const userCart = useMemo(() => carts.store.find(
    (s) => s.user_id === userProfile.user.id
  ) ?? { user_id: 0, order: [], n_item: 0, total: 0 },
  [carts.store, userProfile.user.id]);

  const locationId = userCart.location_id ?? userProfile.user.main_location_id;

  const deliveryLocation =
    userProfile.user.locations.find((loc) => loc.id == locationId) ??
    defaultUserLocation;

  const cartReq = cartToOrderRequest(userCart, deliveryLocation);

  const { data: cartDetailData, mutate, error: cartError } = useAPIFetcher<OrdersResponse>(
    "/orders/cart-info",
    {
      method: "POST",
      accessToken: session.access_token,
      body: cartReq,
      requireToken: true,
    }
  );
  const cartDetail = cartDetailData?.data ?? defaultOrdersResponse;

  useEffect(() => {
    cartDetail.orders.map(
      (order, orderIdx) =>
        orderIdx < userCart.order.length && order.items?.map((item) =>
         { if (item.product.classification === "Obat Keras") {
            setIsPrescription(true)
          }}
        )
        )
  }, [cartDetail, userCart]);
  
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const onSelectImageFile = () => {
		if (inputFileRef.current) {
			inputFileRef.current.click();
			if (
				inputFileRef.current.files !== null &&
				inputFileRef.current.files !== undefined &&
				inputFileRef.current.files.length > 0
			) {
				setErrorPrescription(false)
			} else {
        setErrorPrescription(true)
      }
		}
	};

  const handleReset = () => {
    if (inputFileRef.current) {
        inputFileRef.current.value = "";
    }
};

  useEffect(() => {
    mutate();
  }, [mutate, needMutate]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCourier,
    onOpen: onOpenCOurier,
    onClose: onCloseCourier,
  } = useDisclosure();
  const [isPrescription, setIsPrescription] = useState(false);

  const summary = summarizeCart(userCart, cartDetail);

  const [createLoading, setCreateLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    dispatch(
      updateCartSummary({
        user_id: userProfile.user.id,
        n_item: summary.n_items,
        total: summary.total,
      })
    );
  }, [dispatch, userProfile.user.id, summary.n_items, summary.total]);

  function findCourier(id: number) {
    return couriers.find((courier) => {
      return courier.id === id;
    });
  }



  async function handleCartCheckout() {
    try {
      setCreateLoading(true);
      const orders = await createOrder(cartReq, session.access_token);
      dispatch(resetCart(userProfile.user.id));
      toast({
        title: "Checkout Success",
        description: "check transaction history and upload your payment proof.",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      router.push("/profile?subpage=transaction%20history");
    } catch (e) {
      toast({
        title: "Request Failed",
        description: "failed to process request.",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setCreateLoading(false);
    }
  }
  
  function handleCartReset() {
    dispatch(resetCart(userProfile.user.id));
    notifyMutate({});
  }

  return (
    <Flex flexDirection={"column"} h={"full"}>
      <Flex
        className="bg-white h-20 lg:h-24 max-w-screen w-full px-8 lg:px-16 shadow-md sticky top-0 z-50"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Link href={"/home"}>
          <Image src={Logo} alt="Medichat Logo" className="w-48" />
        </Link>
      </Flex>
      <Flex
        alignItems={"center"}
        bg={colors.primary}
        height={"150px"}
        w={"full"}
        className="px-8 lg:px-16"
      >
        <Flex gap={"30px"}>
          <Text color={colors.white} fontSize={"32px"} fontWeight={600} onClick={router.back} className="hover:cursor-pointer">
            <i className="fa-solid fa-chevron-left"></i>
          </Text>
          <Text color={colors.white} fontSize={"32px"} fontWeight={600}>
            My Cart
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        w={"full"}
        gap={"20px"}
        className="px-8 lg:px-16 py-8 lg:py-16 min-h-screen"
        justifyContent={"space-around"}
        bg={colors.secondary}
      >
        <Stack>
          <Card w={{ lg: "700px" }} padding={"30px"} minH={"200px"}>
            <Flex
              h={"full"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              gap={"10px"}
            >
              {/* <Checkbox defaultChecked>Select All Products</Checkbox> */}
              <Divider />
              <Box
                borderRadius={"8px"}
                border={`1px solid ${colors.secondaryText}70`}
                padding={"20px"}
              >
                <Flex
                  justifyContent={"space-between"}
                  w={"full"}
                  flexDirection={{ base: "column", lg: "row" }}
                >
                  <Text color={colors.secondaryText} fontWeight={600}>
                    Shipping Address
                  </Text>
                  <Text
                    onClick={onOpen}
                    color={colors.primary}
                    cursor={"pointer"}
                  >
                    Change Address
                  </Text>
                </Flex>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Choose Address</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="flex flex-col gap-5">
                      {userProfile.user.locations.map((location) => (
                        <Card shadow={"2xl"} key={location.id} padding={"20px"}>
                          <Flex flexDirection={"column"} gap={"20px"}>
                            {location.id === locationId && (
                              <Badge
                                bg={colors.success}
                                color={colors.white}
                                w={"fit-content"}
                              >
                                <i className="fa-solid fa-circle-check"></i>{" "}
                                Selected
                              </Badge>
                            )}
                            <Box>
                              <Flex gap={"10px"}>
                                <Text fontSize={"20px"} color={colors.primary}>
                                  <i className="fa-solid fa-location-dot"></i>
                                </Text>
                                <Box>
                                  <Text fontSize={"18px"} fontWeight={600}>
                                    {location.alias}
                                  </Text>
                                  <Text color={colors.secondaryText}>
                                    {location.address}
                                  </Text>
                                  <Link
                                    target="_blank"
                                    href={`https://www.google.com/maps/search/?api=1&query=${location.coordinate.lat},${location.coordinate.lon}`}
                                  >
                                    <Text
                                      fontWeight={600}
                                      color={colors.primary}
                                      className="hover:underline hover:underline-offset-2"
                                    >
                                      Open Map
                                    </Text>
                                  </Link>
                                </Box>
                              </Flex>
                            </Box>
                            {location.id !== locationId ? (
                              <Button
                                variant={"brandPrimary"}
                                onClick={() => {
                                  dispatch(
                                    setDeliveryLocationID({
                                      user_id: userProfile.user.id,
                                      location_id: location.id,
                                    })
                                  );
                                  notifyMutate({});
                                }}
                              >
                                Select
                              </Button>
                            ) : (
                              <Button
                                bg={`${colors.secondaryText}50`}
                                color={colors.secondaryText}
                                isDisabled={true}
                              >
                                Select
                              </Button>
                            )}
                          </Flex>
                        </Card>
                      ))}
                      <Button
                        variant={"brandPrimary"}
                        onClick={() =>
                          router.push("/profile?subpage=manage%20addresses")
                        }
                      >
                        Add New Address
                      </Button>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Flex gap={"10px"}>
                  <Text color={colors.primary}>
                    <i className="fa-solid fa-location-dot"></i>
                  </Text>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/maps/search/?api=1&query=${deliveryLocation.coordinate.lat},${deliveryLocation.coordinate.lon}`}
                  >
                    <Text fontWeight={600}>{deliveryLocation.alias}</Text>
                    <Text color={colors.secondaryText}>
                      {deliveryLocation.address}
                    </Text>
                  </Link>
                </Flex>
              </Box>
            </Flex>
          </Card>
          {cartError && (
            <Text color="red">
              Error fetching cart info.
            </Text>
          )}
          {cartDetail.orders.map(
            (order, orderIdx) =>
              orderIdx < userCart.order.length && (
                <Card
                  key={order.id}
                  w={{ lg: "700px" }}
                  padding={"30px"}
                >
                  <Flex
                    h={"full"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    gap={"20px"}
                  >
                    {/* <Checkbox defaultChecked> */}
                    <Text fontWeight={600}>
                      <i className="fa-solid fa-shop"></i> {order.pharmacy.name}
                    </Text>
                    {/* </Checkbox> */}
                    <Divider />
                    {order.items?.map(
                      (item, itemIdx) =>
                        itemIdx < userCart.order[orderIdx].items.length && (
                          <Flex
                            key={item.id}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            flexDirection={{ base: "column", lg: "row" }}
                          >
                            <Flex gap={"20px"}>
                              {/* <Checkbox></Checkbox> */}
                              <Link href={`/medishop/${item.product.slug}`}>
                                <Box className="relative">
                                  <Img
                                    src={item.product.photo_url}
                                    alt={item.product.name}
                                    width={{ base: "100px", lg: "150px" }}
                                    height={{ base: "100px", lg: "150px" }}
                                    objectFit={"contain"}
                                    border={`1px solid ${colors.secondaryText}50`}
                                    borderRadius={"8px"}
                                  />
                                  {item.product.classification === "Obat Keras" &&  
                                  (
                                    <Box
                                      width={"30px"}
                                      height={"30px"}
                                      bg={colors.danger}
                                      borderRadius={"100%"}
                                      border={"1px solid black"}
                                      className="absolute right-3 top-3"
                                    ></Box>
                                  )}
                                </Box>
                              </Link>

                              <Flex
                                flexDirection={"column"}
                                justifyContent={"space-between"}
                                className="py-5"
                              >
                                <Flex h={"fit-content"}>
                                  <Text>{item.product.name.length > 25 ? `${item.product.name.slice(0, 26)}...` : item.product.name}</Text>
                                </Flex>
                                <Text
                                  color={colors.secondaryText}
                                  fontSize={"14px"}
                                >
                                  Unit price: Rp {item.price.toLocaleString()}
                                </Text>
                                <Text color={colors.primary} fontWeight={600}>
                                  Rp{" "}
                                  {(
                                    item.price *
                                    userCart.order[orderIdx].items[itemIdx]
                                      .amount
                                  ).toLocaleString()}
                                </Text>
                              </Flex>
                            </Flex>
                            <Flex gap={"20px"} alignItems={"center"}>
                              <Button
                                color={colors.danger}
                                fontSize={"20px"}
                                onClick={() => {
                                  dispatch(
                                    deleteProductOrder({
                                      user_id: userProfile.user.id,
                                      pharmacy_slug: order.pharmacy.slug,
                                      product_slug: item.product.slug,
                                    })
                                  );
                                  notifyMutate({});
                                }}
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </Button>
                              <Flex gap={"5px"}>
                                {userCart.order[orderIdx].items[itemIdx]
                                  .amount < 2 ? (
                                  <Button
                                    color={colors.secondaryText}
                                    isDisabled={true}
                                  >
                                    -
                                  </Button>
                                ) : (
                                  <Button
                                    variant={"brandPrimary"}
                                    onClick={() => {
                                      dispatch(
                                        decrementProductOrder({
                                          user_id: userProfile.user.id,
                                          pharmacy_slug: order.pharmacy.slug,
                                          product_slug: item.product.slug,
                                        })
                                      );
                                    }}
                                  >
                                    -
                                  </Button>
                                )}
                                <Input
                                  textAlign={"center"}
                                  width={"60px"}
                                  type="number"
                                  readOnly
                                  value={
                                    userCart.order[orderIdx].items[itemIdx]
                                      .amount
                                  }
                                />
                                <Button
                                  variant={"brandPrimary"}
                                  onClick={() => {
                                    dispatch(
                                      incrementProductOrder({
                                        user_id: userProfile.user.id,
                                        pharmacy_slug: order.pharmacy.slug,
                                        product_slug: item.product.slug,
                                      })
                                    );
                                  }}
                                >
                                  +
                                </Button>
                              </Flex>
                            </Flex>
                          </Flex>
                        )
                    )}
                    <Box
                      borderRadius={"8px"}
                      border={`1px solid ${colors.secondaryText}70`}
                      padding={"20px"}
                      onClick={onOpenCOurier}
                      cursor={"pointer"}
                    >
                      <Flex
                        justifyContent={"space-between"}
                        w={"full"}
                        alignItems={"center"}
                      >
                        <Flex gap={{ lg: "50px" }}>
                          <Image
                            src={findCourier(order.shipment_method.id)?.image ?? ""}
                            width={"80"}
                            height={"80"}
                            objectFit={"contain"}
                            alt="Courier Logo"
                          />
                          <Flex
                            flexDirection={"column"}
                            justifyContent={"space-around"}
                          >
                            <Text fontWeight={600}>
                              {findCourier(order.shipment_method.id)?.name}
                            </Text>
                            <Text fontWeight={600} color={colors.secondaryText}>
                              {toRupiah(order.shipment_fee)}
                            </Text>
                          </Flex>
                        </Flex>
                        <Text fontSize={"20px"}>
                          <i className="fa-solid fa-chevron-right"></i>
                        </Text>
                      </Flex>
                    </Box>
                    <Modal isOpen={isOpenCourier} onClose={onCloseCourier}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Choose Courier</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody className="flex flex-col gap-5">
                          {couriers.map((courier) => (
                            <Card
                              shadow={"2xl"}
                              key={courier.id}
                              padding={"20px"}
                            >
                              <Flex flexDirection={"column"} gap={"20px"}>
                                {courier.id === order.shipment_method.id && (
                                  <Badge
                                    bg={colors.success}
                                    color={colors.white}
                                    w={"fit-content"}
                                  >
                                    <i className="fa-solid fa-circle-check"></i>{" "}
                                    Selected
                                  </Badge>
                                )}
                                <Box>
                                  <Flex gap={"20px"} alignItems={"center"}>
                                    <Image
                                      src={findCourier(order.shipment_method.id)?.image ?? ""}
                                      alt="Courier Logo"
                                      width={"100"}
                                      height={"100"}
                                      objectFit={"contain"}
                                    />
                                    <Stack>
                                      <Text fontWeight={600}>
                                        {findCourier(courier.id)?.name}
                                      </Text>
                                    </Stack>
                                  </Flex>
                                </Box>
                                {courier.id !== order.shipment_method.id ? (
                                  <Button
                                    variant={"brandPrimary"}
                                    onClick={() => {
                                      dispatch(
                                        setOrderShipmentMethod({
                                          user_id: userProfile.user.id,
                                          pharmacy_slug: order.pharmacy.slug,
                                          shipment_method_id: courier.id,
                                        })
                                      );
                                      notifyMutate({});
                                    }}
                                  >
                                    Select
                                  </Button>
                                ) : (
                                  <Button
                                    bg={`${colors.secondaryText}50`}
                                    color={colors.secondaryText}
                                    isDisabled={true}
                                  >
                                    Select
                                  </Button>
                                )}
                              </Flex>
                            </Card>
                          ))}
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </Flex>
                </Card>
              )
          )}
        </Stack>
        <Stack>
          <Card w={{ lg: "700px" }} padding={"30px"} minH={"200px"}>
            <Flex
              h={"full"}
              w={"full"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              gap={"15px"}
            >
              <Text
                color={colors.secondaryText}
                fontWeight={600}
                fontSize={"18px"}
              >
                Payment Summary
              </Text>
              <Divider />
              <Flex justifyContent={"space-between"} w={"full"}>
                <Text fontSize={"14px"}>Cart ({summary.n_items} items)</Text>
                <Text>Rp {summary.subtotal.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent={"space-between"} w={"full"}>
                <Text fontSize={"14px"}>Shipment Fee</Text>
                <Text>Rp {summary.shipment_fee.toLocaleString()}</Text>
              </Flex>
              <Divider />
              <Flex justifyContent={"space-between"} w={"full"}>
                <Text color={colors.secondaryText} fontWeight={600}>
                  Total
                </Text>
                <Text>Rp {summary.total.toLocaleString()}</Text>
              </Flex>
            </Flex>
          </Card>
          {isPrescription && (
          <Card w={{ lg: "700px" }} padding={"30px"} minH={"200px"}>
            <Flex
              h={"full"}
              w={"full"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              gap={"15px"}
            >
              <Text
                color={colors.secondaryText}
                fontWeight={600}
                fontSize={"18px"}
              >
                Prescription Attachment
              </Text>
              <Divider />
              <Flex gap={"10px"} alignItems={"center"}>
                <Flex
                  width={"100px"}
                  height={"100px"}
                  border={`1px ${(errorPrescription || inputFileRef.current?.files == null || inputFileRef.current?.files[0] == null) ? 'dashed' : 'solid'} ${colors.primary}`}
                  borderRadius={"8px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  cursor={"pointer"}
                  onClick={() => onSelectImageFile()}
                >
                  <Text color={colors.primary} fontSize={"50px"}>
                    {
                      (errorPrescription || inputFileRef.current?.files == null || inputFileRef.current?.files[0] == null)  && <i className="fa-solid fa-plus"></i>
                    }
                    {
                      (inputFileRef.current?.files != null && inputFileRef.current.files[0] != null && !errorPrescription) && <i className="fa-solid fa-prescription"></i>
                    }
                  </Text>
                </Flex>
                {
                  (inputFileRef.current?.files != null && inputFileRef.current.files[0] != null && !errorPrescription) &&
                  <Flex alignItems={"center"} gap={"5px"} color={colors.primary}>
                    <Text>{inputFileRef.current.files[0].name}</Text>
                    <i className="fa-solid fa-xmark hover:cursor-pointer" onClick={() => handleReset()}></i>
                  </Flex>
                }
              </Flex>
						<Input type="file" className="hidden" ref={inputFileRef} accept="image/png"/>
               {
                 (errorPrescription || inputFileRef.current?.files == null || inputFileRef.current?.files[0] == null) &&  <Tag
                className="flex gap-1"
                color={colors.danger}
                bg={`${colors.danger}20`}
              >
                <i className="fa-solid fa-circle-info"></i>
                Item you ordered requires a prescription
              </Tag>
               }
            </Flex>
          </Card>
            )}
          <Button
            variant={"brandPrimary"}
            onClick={handleCartCheckout}
            isDisabled={userCart.order.length == 0 || cartError}
            isLoading={createLoading}
          >
            Check Out
          </Button>
          <Button
            colorScheme="red"
            onClick={handleCartReset}
            isLoading={createLoading}
          >
            Reset Cart
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
}

type ServerSideProps = {
  session: SessionData;
  userProfile: GetUserProfile;
};

export default Page;

export const getServerSideProps = prepareServerSide((async (context) => {
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

    let userProfileRes: APIResponse<GetUserProfile> | undefined;
    if (sessionData.role === role.USER) {
      userProfileRes = await getUserProfile(sessionData.access_token);
    }

    return {
      props: {
        session: sessionData,
        userProfile: userProfileRes?.data ?? defaultGetUserProfile,
      },
    };
  } catch (e) {
    throw (e)
  }
}) satisfies GetServerSideProps<ServerSideProps>);
