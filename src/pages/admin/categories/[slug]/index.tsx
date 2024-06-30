import Header from "@/components/ui/Header";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import {  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Categories } from "@/types/responses/admin";
import {
  deleteCategoriesBySlug,
  getCategories,
  getCategoriesBySlug,
} from "@/services/admin";
import TableAdmin, { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import { SessionData, defaultSession } from "@/utils/session";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import { Container } from "postcss";
import { CategoryWithParentName } from "@/types/responses/category";
import Alert from "@/components/modal/Alert";

const columns: TableColumn[] = [
  { key: "category", label: "Category" },
  { key: "", label: "" },
];

const Page = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [data, setData] = useState<CategoryWithParentName | undefined>();
  const [dataChild, setDataChild] = useState<Categories[] | undefined>();
  const sendAlertCancelRef = React.useRef(null);



  const router = useRouter();
  const { slug } = router.query;
  const {
    isOpen: isDeleteAlertOpen,
    onClose: onDeleteAlertClose,
    onOpen: onDeleteAlertOpen,
  } = useDisclosure();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await getCategoriesBySlug(
          session.access_token,
          slug as string
        );
        setData(res?.data);
        console.log(res?.data?.photo_url);
        
      } catch (e) {}
    };

    getCategories();
  }, [session.access_token, slug]);

  useEffect(() => {
    const getCategoriesChild = async () => {
      try {
        const resChild = await getCategories(
          session.access_token,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          slug as string,
          undefined
        );
        if (resChild) {
          setDataChild(resChild?.data?.categories);
        }
      } catch (e) {}
    };
    getCategoriesChild();
  }, [session.access_token, slug]);

  const tableData: TableData[] = [];
  if (dataChild) {
    dataChild.map((category) => {
      const categories: TableData = {
        id: category.id,
        category: category.name,
      };
      tableData.push(categories);
    });
  }

  function onEditButtonClick(): void {
    router.push({
      pathname: "[slug]/edit",
      query: { slug: slug },
    });
  }

  function onDetailButtonClick(rowData: TableData): void {
    if (dataChild) {
      const Category = dataChild.find((cat) => cat.id === rowData.id);
      const slug = Category ? Category.slug : "-";
      router.push(`${slug}`);
    }
  }

  function OnDeleteButtonClick(): void {
    const deleteProduct = async () => {
      try {
        const res = await deleteCategoriesBySlug(
          slug as string,
          session.access_token,
        );
        setData(res?.data);
        router.replace({
          pathname: "/admin/categories",
        })
      } catch (e) {}
    };
    deleteProduct();
    ;
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
                  {data?.name}
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
          Category Detail
        </Text>
        <Stack mt={"15px"}>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Category Name
          </Text>
          <Text color={colors.secondaryText}>{data?.name}</Text>
          <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
            Level
          </Text>
          <Text color={colors.secondaryText}>
            {data?.parent_name ? "2" : "1"}
          </Text>
          {!data?.parent_name ? (
            <>
              <Text
                fontWeight={600}
                fontSize={"18px"}
                color={colors.primaryText}
              >
                Child
              </Text>
              <Flex maxW={"auto"}>
                <TableAdmin
                  columns={columns}
                  data={tableData}
                  onDetailButtonClick={onDetailButtonClick}
                ></TableAdmin>
              </Flex>
            </>
          ) : (
            <>
              <Text
                fontWeight={600}
                fontSize={"18px"}
                color={colors.primaryText}
              >
                Parent
              </Text>
              <Text color={colors.secondaryText}>{data?.parent_name}</Text>
            </>
          )}
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
          Are you sure want to delete category? <br />
          (If you delete a level 1 category, all its children will also be
          deleted.)
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
