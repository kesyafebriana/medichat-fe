import Header from "@/components/ui/Header";
import { NextPageContext } from "next";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { confirmOrder, getOrdersByInvoice } from "@/services/admin";
import { Payments } from "@/types/responses/admin";
import useSession from "@/hooks/useSession";
import Link from "next/link";
import { toRupiah } from "@/utils/convert";

const Page = () => {
  const router = useRouter();
  const { orderid } = router.query;
  const [data, setData] = useState<Payments>();
  const session = useSession();
  const toast = useToast();

  const getOrder = async () => {
    if (orderid) {
     const data = await getOrdersByInvoice(orderid as string, session.session?.access_token ?? "")
     setData(data?.data)
     console.log(data)
    }
    }

  useEffect(() => { 
     getOrder()
   }, [orderid, session.session?.access_token]);

   const confirmPaymentData = async (invoice: string) => {
    try {
      await confirmOrder(invoice, session.session?.access_token ?? "")
      toast({
        status: "success",
        title: "Payment Successfully Confirmed",
        isClosable: true,
        position: "top-right",
        description: "The payment has been successfully confirmed..",
        icon: (
          <>
            <i className="fa-solid fa-circle-check"></i>
          </>
        ),
      });
      getOrder()
    } catch (e:any) {
      toast({
        status: "error",
        title: "Confirm Payment Failed",
        position: "top-right",
        isClosable: true,
        description: "Please try again in a few moments.",
        icon: (
          <>
            <i className="fa-solid fa-circle-xmark"></i>
          </>
        ),
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
                  Payment Info
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
        mt={{ base: "30px", lg: "20px" }}
        mb={{ lg: "50px" }}
        className="px-8 lg:px-16"
      >
      <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
           ID
          </Text>
        <Text color={colors.secondaryText}>{data?.id}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Invoice Number
          </Text>
          <Text color={colors.secondaryText}>{data?.invoice_number}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            User Id
          </Text>
          <Text color={colors.secondaryText}>{data?.user.id}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Total
          </Text>
          <Text color={colors.secondaryText}>{toRupiah(parseInt(data?.amount as string))}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Confirmation Status
          </Text>
          <Text color={colors.secondaryText}>{data?.is_confirmed.toString()}</Text>
         <Flex className="gap-4 mt-8 items-center">
         {
          data?.file_url &&  <><Link href={data?.file_url} download>
          <Button variant="brandPrimary">Open Payment Proof</Button>
         </Link>
         {
          !data?.is_confirmed && <Button bg={colors.success} color={colors.white} w={"fit-content"} onClick={() => confirmPaymentData(data?.invoice_number ?? "")}>
              Confirm Payment
          </Button>
        }   
         </>
         } 
         {
          !data?.file_url && <>
          <Flex>
            <Button variant="brandPrimary" isDisabled>Payment Proof Not Uploaded Yet</Button>
          </Flex> {
          !data?.is_confirmed && <Button bg={colors.success} color={colors.white} w={"fit-content"} isDisabled>
              Confirm Payment
          </Button>
        } </>
         } 
        <Text />
         </Flex>
        </Stack>
    </>
  );
};

export default Page;
