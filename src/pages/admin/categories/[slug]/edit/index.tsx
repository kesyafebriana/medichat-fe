import Header from "@/components/ui/Header";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { useRouter } from "next/router";
import { CategoriesResponse } from "@/types/responses/admin";
import { editCategoryBySlug, getCategoriesBySlug } from "@/services/admin";
import { EditCategoryFields } from "@/types/validator/admin";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import { SessionData, defaultSession } from "@/utils/session";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import TableAdmin from "@/components/ui/TableAdmin";

const Page = (
  { session }: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const [data, setData] = useState<CategoriesResponse | undefined>();
  const router = useRouter();
  const { slug } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_name: "",
    image: undefined as any,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.data?.name || "",
        image: data.data?.photo_url,
        slug: data.data?.name || "",
        parent_name: data.data?.parent_name || "",
      });
    }
  }, [data]);

  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePrev, setImagePrev] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editCategoryData(formData);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await getCategoriesBySlug(session.access_token ,slug as string);
        setData(res);
      } catch (e) {}
    };

    getCategories();
  }, [session.access_token, slug]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePrev(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function backPage (){
    router.replace("/admin/categories")
  }



  const toast = useToast()

  const editCategoryData = async (values: EditCategoryFields) => {
    try {      
      if (image) { 
      await editCategoryBySlug(session.access_token, {...values, image: image} , slug,);
      toast({
        title: "Edit Category",
        description: "Successfully edit category",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      })
      setTimeout(
        backPage, 3000
      )
    } else
      {
        toast({
          title: "Edit Category",
          description: "Please add image",
          status: "error",
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
      };
    } catch (e) {}
  };

  return (
    <>
      <Header role="admin" />
      <form onSubmit={handleSubmit}>
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
                {imagePrev ? 
                <Image
                  w={"300px"}
                  h={"300px"}
                  borderRadius={"8px"}
                  objectFit={"fill"}
                  src={imagePrev}
                  alt={formData.name}
                /> : <Image
                w={"300px"}
                h={"300px"}
                borderRadius={"8px"}
                objectFit={"fill"}
                src={formData.image}
                alt={formData.name} />}
              </Box>
              <Flex
                flexDirection={"column"}
                justifyContent={"space-between"}
                w={"80%"}
                h={"300px"}
              >
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
          <Button
            as="label"
            htmlFor="image"
            bgColor={colors.primary}
            color={colors.white}
            variant="solid"
            width={"200px"}
            _hover={{ bg: "#0057FF" }}
            marginBottom={"50px"}
          >
            Add Image
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </Button>
          <Text color={colors.primary} fontSize={"28px"} fontWeight={600}>
            Category Detail
          </Text>
          <Stack mt={"15px"}>
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Category Name
            </Text>
            <Input
              color={colors.secondaryText}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Text fontWeight={600} fontSize={"18px"} color={colors.primaryText}>
              Level
            </Text>
            <Input
              color={colors.secondaryText}
              value={formData.parent_name ? "2" : "1"}
              disabled
            />
            <Button
              type="submit"
              width="auto"
              backgroundColor={colors.danger}
              color="white"
              fontWeight="600"
              _hover={{ bg: colors.danger }}
            >
              Save
            </Button>
          </Stack>
          <Text />
        </Stack>
      </form>
    </>
  );
};

interface AddCategoryProps {
  categoryRedirect: string;
}

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
