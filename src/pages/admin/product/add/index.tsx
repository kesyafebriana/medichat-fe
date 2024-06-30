import { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/components/ui/Header";
import { useRouter } from "next/router";
import { addProduct, getCategories } from "@/services/admin";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  useToast,
  Image,
} from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";

import NextImage from "next/image";
import { colors } from "@/constants/colors";
import previewImg from "@/../public/assets/img/preview300x300.png";
import { AddProductFields } from "@/types/validator/admin";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import { SessionData, defaultSession } from "@/utils/session";
import { useFormState } from "@/hooks/useFormState";
import { Level1Picker } from "@/components/table/CategoryTable";
import { SingleValue } from "chakra-react-select";
import useSession from "@/hooks/useSession";
import _ from "lodash";

const AddProductPage = (
  // { productRedirect }: AddProductProps,
  { session }: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { onLoading } = useFormState();
  const toast = useToast();

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    composition: "",
    content: "",
    manufacturer: "",
    description: "",
    category_id: 0,
    product_classification: "",
    product_form: "",
    unit_in_pack: "",
    selling_unit: "",
    picture: undefined as any,
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
  });
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePrev, setImagePrev] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePrev(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function backPage() {
    router.replace("/admin/product");
  }

  const addProductData = async (values: AddProductFields) => {
    try {
      onLoading();
      if (!image) return;
      await addProduct(session.access_token, { ...values, picture: image });
      toast({
        title: "Create Product",
        description: "Successfully created product",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      setTimeout(backPage, 3000);
    } catch (e) {
      toast({
        title: "Create Product",
        description: `Create product failed because ${e}`,
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleSubmitButton = () => {
    addProductData(formData);
    console.log(formData);
    console.log(session.access_token);
  };

  const onChooseCategories = (newValue: SingleValue<string>) => {
    const v = newValue as unknown as { value: string; label: string, meta: {id:number}};
    console.log(v.label, v.value, v.meta.id);
    
    formData.category_id = v.meta.id
  };

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
              backgroundImage="url('/assets/img/preview300x300.png')"
              width={{ base: "full", lg: "300px" }}
              height={{ base: "full", lg: "300px" }}
              objectFit={"contain"}
              className="shadow-lg"
              borderRadius={"8px"}
              maxW={{ lg: "20%" }}
            >
              {
                imagePrev ? 
                <Image
                  width={"300px"}
                  height={"300px"}
                  objectFit={"fill"}
                  src={imagePrev}
                  alt=""
                /> : <NextImage
                  width={"300"}
                  height={"300"}
                  objectFit={"fill"}
                  src={previewImg}
                  alt=""
                />
              }
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
                gap={"30px"}
              >
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
      {/* <form onSubmit={handleSubmit}> */}
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
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Name
          </FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Generic Name
          </FormLabel>
          <Input
            type="text"
            name="generic_name"
            value={formData.generic_name}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Description
          </FormLabel>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Content
          </FormLabel>
          <Input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Composition
          </FormLabel>
          <Input
            type="text"
            name="composition"
            value={formData.composition}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Category
          </FormLabel>
        <CategoryPicker onChange={onChooseCategories}></CategoryPicker>
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Product Classification
          </FormLabel>
          <Input
            type="text"
            name="product_classification"
            value={formData.product_classification}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Manufacture
          </FormLabel>
          <Input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Product Form
          </FormLabel>
          <Input
            type="text"
            name="product_form"
            value={formData.product_form}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Unit in Pack
          </FormLabel>
          <Input
            type="text"
            name="unit_in_pack"
            value={formData.unit_in_pack}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Selling Unit
          </FormLabel>
          <Input
            type="text"
            name="selling_unit"
            value={formData.selling_unit}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Weight
          </FormLabel>
          <Input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Width
          </FormLabel>
          <Input
            type="text"
            name="width"
            value={formData.width}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Height
          </FormLabel>
          <Input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            fontWeight={600}
            fontSize={"18px"}
            color={colors.primaryText}
          >
            Length
          </FormLabel>
          <Input
            type="text"
            name="length"
            value={formData.length}
            onChange={handleInputChange}
            color={colors.secondaryText}
          />
        </FormControl>
      </Stack>
      <Flex width={"100vw"} justifyContent={"center"} marginBottom={"50px"}>
        <Button
          mt={4}
          onClick={handleSubmitButton}
          bgColor={colors.primary}
          color={"white"}
          _hover={{ bg: "#0057FF" }}
          textAlign={"center"}
          isDisabled={
            formData.name === "" ||
            formData.generic_name === "" ||
            formData.description === "" ||
            formData.content === "" ||
            formData.composition === "" ||
            formData.category_id === 0 ||
            formData.product_classification === "" ||
            formData.manufacturer === "" ||
            formData.product_form === "" ||
            formData.unit_in_pack === "" ||
            formData.selling_unit === "" ||
            formData.picture === "" ||
            formData.weight === 0 ||
            formData.width === 0 ||
            formData.height === 0 ||
            formData.length === 0
          }
        >
          Add Product
        </Button>
      </Flex>
      {/* </form> */}
    </>
  );
};

interface AddProductProps {
  productRedirect: string;
}

export default AddProductPage;

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

const CategoryPicker = ({
  onChange,
  placeholder = "Choose category level 1",
}: CategoryPickerProps) => {
  const { session } = useSession();
  return (
    <>
      <AsyncSelect
        onChange={onChange}
        name="products"
        placeholder={placeholder}
        loadOptions={_.debounce((inputValue, callback) => {
          const findProducts = async (term: string) => {
            try {
              const res = await getCategories(
                session?.access_token ?? "",
                undefined,
                undefined,
                undefined,
                undefined,
                term,
                undefined,
                2
              );
              const result = res?.data?.categories.map((c) => ({
                value: c.slug,
                label: c.name,
                meta: {
                  id: c.id,
                },
              }));
              callback(result ?? []);
            } catch (e) {
              callback([]);
            }
          };
          findProducts(inputValue);
        }, 250)}
      />
    </>
  );
};

interface CategoryPickerProps {
  placeholder?: string;
  onChange: (newValue: SingleValue<string>) => void;
}