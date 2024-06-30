import OrderAlert from "@/components/modal/OrderAlert";
import PaymentModal from "@/components/modal/PaymentModal";
import { colors } from "@/constants/colors";
import { role } from "@/constants/role";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { Unauthorized } from "@/exceptions/unauthorized";
import Layout from "@/layouts/layout";
import { cancelOrder, finishOrder, getOrderByID } from "@/services/order";
import { getUserProfile } from "@/services/profile";
import { APIResponse } from "@/types/responses";
import {
  OrderItemResponse,
  OrderResponse,
  defaultOrderResponse,
} from "@/types/responses/order";
import {
  GetUserProfile,
  defaultGetUserProfile,
} from "@/types/responses/profile";
import { handleServerSideError } from "@/utils/exception";
import { formatDate, getStatusColor } from "@/utils/order";
import prepareServerSide from "@/utils/prepareServerSide";
import { SessionData, defaultSession } from "@/utils/session";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Img,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

interface OrderItemRowProps {
  item: OrderItemResponse;
}

function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <Link href={`/medishop/${item.product.slug}`}>
      <Flex alignItems={"start"} flexDirection={"row"} gap={"20px"}>
        <Box className="relative">
          <Img
            src={item.product.photo_url}
            alt={item.product.name}
            width={{ base: "100px", lg: "100px" }}
            height={{ base: "100px", lg: "100px" }}
            objectFit={"contain"}
            border={`1px solid ${colors.secondaryText}50`}
            borderRadius={"8px"}
          />
        </Box>
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <Text fontWeight={600}>{item.product.name}</Text>
          <Text color={colors.secondaryText} fontSize={"14px"}>
            {item.amount} x Rp {item.price.toLocaleString()}
          </Text>
          <Text fontWeight={600}>
            Rp {(item.price * item.amount).toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
}

export default function Page({
  session,
  userProfile,
  slug,
  order,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [currentStatus, setStatus] = useState(order.status);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const {
    onClose: onCloseCancelAlert,
    onOpen: onOpenCancelAlert,
    isOpen: isOpenCancelAlert,
  } = useDisclosure();
  const cancelCancelRef = useRef();

  const {
    onClose: onCloseFinishAlert,
    onOpen: onOpenFinishAlert,
    isOpen: isOpenFinishAlert,
  } = useDisclosure();
  const cancelFinishRef = useRef();

  async function onCancel() {
    try {
      await cancelOrder(slug, session.access_token);
      toast({
        title: "Order Cancelled",
        description: "successfully cancelled the order.",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      setStatus("cancelled");
    } catch (e: any) {
      toast({
        title: "Request Failed",
        description: "failed to process request.",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  }

  async function onFinish() {
    try {
      await finishOrder(slug, session.access_token);
      toast({
        title: "Order Finished",
        description: "successfully finished the order.",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      setStatus("finished");
    } catch (e: any) {
      toast({
        title: "Request Failed",
        description: "failed to process request.",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  }

  return (
    <Layout>
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
            Order
          </Text>
        </Flex>
      </Flex>
      <Flex
        className="my-8 px-8 lg:px-16"
        gap={"20px"}
        w={"full"}
        flexDirection={{ base: "column", lg: "row" }}
        justifyContent={"space-around"}
      >
        <Stack width={"full"}>
          <Card size={"2xl"} className="p-8" borderRadius={"8px"}>
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
                Order Summary
              </Text>
              <Divider />
              <Text fontWeight={600} fontSize={"18px"}>
                <i className="fa-solid fa-shop"></i> {order.pharmacy.name}
              </Text>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Ordered At
                </Text>
                <Text fontSize={"14px"} color={colors.secondaryText}>
                  {formatDate(new Date(order.ordered_at))}
                </Text>
              </Flex>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Address
                </Text>
                <Flex gap={"10px"} alignItems={"center"}>
                  <Text color={colors.secondaryText} fontSize={"14px"}>
                    <i className="fa-solid fa-location-dot"></i>
                  </Text>
                  <Text color={colors.secondaryText} fontSize={"14px"}>
                    {order.address}
                  </Text>
                </Flex>
              </Flex>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Shipment Method
                </Text>
                <Text color={colors.secondaryText} fontSize={"14px"}>
                  {order.shipment_method.name}
                </Text>
              </Flex>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Status
                </Text>
                <Flex gap={"10px"} alignItems={"center"}>
                  <Badge
                    color={getStatusColor(currentStatus)}
                    bg={`${getStatusColor(currentStatus)}20`}
                  >
                    {currentStatus.toUpperCase()}
                  </Badge>
                </Flex>
              </Flex>
              <Divider />
              {order.items?.map((item) => (
                <OrderItemRow item={item} key={item.id} />
              ))}
              <Divider />
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Subtotal
                </Text>
                <Text color={colors.secondaryText} fontSize={"14px"}>
                  Rp {order.subtotal.toLocaleString()}
                </Text>
              </Flex>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Shipment Fee
                </Text>
                <Text color={colors.secondaryText} fontSize={"14px"}>
                  Rp {order.shipment_fee.toLocaleString()}
                </Text>
              </Flex>
              <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
                <Text
                  color={colors.primaryText}
                  fontSize={"14px"}
                  fontWeight={600}
                >
                  Total
                </Text>
                <Text color={colors.primaryText} fontWeight={600}>
                  Rp {order.total.toLocaleString()}
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Stack>
        <Stack width={{ base: "full", lg: "700px" }}>
          <Card size={"2xl"} className="p-8" borderRadius={"8px"}>
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
                <Text fontSize={"14px"}>Invoice Number</Text>
                <Text>{order.payment.invoice_number}</Text>
              </Flex>
              {currentStatus !== "cancelled" && (
                <Button variant={"brandPrimary"} onClick={onOpen}>
                  Details
                </Button>
              )}
              <PaymentModal
                isOpen={isOpen}
                onClose={onClose}
                invoiceNumber={order.payment.invoice_number}
              />
            </Flex>
          </Card>
          {currentStatus === "sent" && (
            <Button variant={"brandPrimary"} onClick={onOpenFinishAlert}>
              Finish Order
            </Button>
          )}
          {(currentStatus === "waiting for payment" ||
            currentStatus === "waiting for confirmation" ||
            currentStatus === "processing") && (
            <Button
              color={colors.white}
              backgroundColor={colors.danger}
              onClick={onOpenCancelAlert}
            >
              Cancel Order
            </Button>
          )}
        </Stack>
      </Flex>
      <OrderAlert
        setStatus="cancel"
        isOpen={isOpenCancelAlert}
        onClose={onCloseCancelAlert}
        cancelRef={cancelCancelRef}
        onConfirm={onCancel}
      />
      <OrderAlert
        setStatus="finish"
        isOpen={isOpenFinishAlert}
        onClose={onCloseFinishAlert}
        cancelRef={cancelFinishRef}
        onConfirm={onFinish}
      />
    </Layout>
  );
}

type ServerSideProps = {
  session: SessionData;
  userProfile: GetUserProfile;
  slug: string;
  order: OrderResponse;
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

    let userProfileRes: APIResponse<GetUserProfile> | undefined;
    if (sessionData.role === role.USER) {
      userProfileRes = await getUserProfile(sessionData.access_token);
    }

    const orderRes = await getOrderByID(slug, sessionData.access_token);

    return {
      props: {
        session: sessionData,
        userProfile: userProfileRes?.data ?? defaultGetUserProfile,
        slug,
        order: orderRes?.data ?? defaultOrderResponse,
      },
    };
  } catch (e) {
    throw e;
  }
}) satisfies GetServerSideProps<ServerSideProps>);
