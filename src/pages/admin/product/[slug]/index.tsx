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
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ProductWithDetails } from "@/types/responses/product";
import { deleteProductBySlug, getProductBySlug } from "@/services/product";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import { SessionData, defaultSession } from "@/utils/session";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import Alert from "@/components/modal/Alert";
import { toTitleCase } from "@/utils/case";

const Page = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [data, setData] = useState<ProductWithDetails | undefined>();
  const router = useRouter();
  const { slug } = router.query;
  const sendAlertCancelRef = React.useRef(null);
  const {
    isOpen: isDeleteAlertOpen,
    onClose: onDeleteAlertClose,
    onOpen: onDeleteAlertOpen,
  } = useDisclosure();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await getProductBySlug(
          slug as string,
          session.access_token
        );
        setData(res?.data);
      } catch (e) {}
    };

    getProduct();
  }, [session.access_token, slug]);

  function onEditButtonClick(): void {
    router.push({
      pathname: "/admin/product/[slug]/edit",
      query: { slug: slug },
    });
  }

  function OnDeleteButtonClick(): void {
    const deleteProduct = async () => {
      try {
        const res = await deleteProductBySlug(
          slug as string,
          session.access_token
        );
        setData(res?.data);
        router.replace({
          pathname: "/admin/product",
        });
      } catch (e) {}
    };

    deleteProduct();
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
            >
              <Image
                w={"300px"}
                h={"300px"}
                borderRadius={"8px"}
                objectFit={"fill"}
                src={data?.photo_url}
                alt={data?.name}
              />
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
                  {toTitleCase(data?.name ?? "")}
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
        <Stack mt={"15px"}>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Generic Name
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.generic_name}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Description
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.description}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Content
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.content}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Composition
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.composition}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Category
          </Text>
          <Text color={colors.secondaryText}>
            {data?.category.parent_name
              ? `${data?.category.parent_name} > ${data.category.name}`
              : data?.category.name}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Product Classification
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.product_classification}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Manufacture
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.manufacturer}
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Product Form
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.product_form}
          </Text>

          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Unit in pack
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.unit_in_pack} packs
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Selling Unit
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.selling_unit} packs
          </Text>

          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Weight
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.height}gr
          </Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Width x Height x Length
          </Text>
          <Text color={colors.secondaryText}>
            {data?.product_detail.width}mm x {data?.product_detail.height}mm x{" "}
            {data?.product_detail.length}mm
          </Text>
          <Button
            width="auto"
            backgroundColor="#1053D4"
            color="white"
            fontWeight="600"
            onClick={() => onEditButtonClick()}
            _hover={{ bg: "#0057FF" }}
          >
            Edit
          </Button>
          <Button
            width="auto"
            backgroundColor={colors.danger}
            color="white"
            fontWeight="600"
            onClick={(e) => {
              onDeleteAlertOpen();
              e.stopPropagation();
            }}
            _hover={{ bg: colors.danger }}
          >
            Delete
          </Button>
        </Stack>
        <Text />
      </Stack>
      <Alert
        isOpen={isDeleteAlertOpen}
        onClose={onDeleteAlertClose}
        cancelRef={sendAlertCancelRef}
        header="Confirmation"
        onOK={OnDeleteButtonClick}
      >
        <div>
          Are you sure want to delete product? <br />
        </div>
      </Alert>
    </>
  );
};
export default Page;

type ServerSideProps = {
  session: SessionData;
};

export const getServerSideProps = (async (context) => {
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

    return {
      props: {
        session: sessionData,
      },
    };
  } catch (e) {
    return {
      props: {
        session: defaultSession,
      },
    };
  }
}) satisfies GetServerSideProps<ServerSideProps>;
