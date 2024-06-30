import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, IconButton, Spinner, Tooltip, useDisclosure } from "@chakra-ui/react";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import Table from "../ui/Table";
import Paginator from "../ui/Paginator";
import Alert from "../modal/Alert";
import { CategoryLevel, CategoryRowData } from "@/types/table/category";
import { CategoryHierarchy, CategoryPaginatedResponse } from "@/types/responses/category";
import { deleteCategoriesBySlug } from "@/services/admin";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import SearchAdmin from "@/components/ui/SearchAdmin";
import { TableData } from "@/components/ui/TableAdmin";
import { colors } from "@/constants/colors";
import { useRouter } from "next/router";
import { addCategory, addCategoryLevel2 } from "@/services/admin";
import {
  AddCategoryFields,
  AddCategoryFieldsLevel2,
} from "@/types/validator/admin";
import { isValidSort, isValidSortBy } from "@/utils/checker";
import { convertToSlug } from "@/utils/convert";
import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ProductPaginatedResponse,
  ProductWithDetails,
} from "@/types/responses/product";
import {
  ProductRowData,
  getProductTableColumn,
  toProductTableData,
} from "@/types/table/product";
import { deleteProductBySlug } from "@/services/product";
import {
  AdminDetailProductPaginatedResponse,
  AdminProduct,
  AdminProductPaginatedResponse,
} from "@/types/responses/admin";
import { APIResponse } from "@/types/responses";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ProductSortPicker from "../ui/ProductSortPicker";
import { productSortBy, sortProduct } from "@/constants/params";

const ProductTable = ({ access_token }: { access_token: string }) => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductRowData>();
  const { onLoading } = useFormState();

  const {
    isOpen: isDeleteAlertOpen,
    onClose: onDeleteAlertClose,
    onOpen: onDeleteAlertOpen,
  } = useDisclosure();
  const sendAlertCancelRef = React.useRef(null);

  const pageParam = urlParams.get("page");
  let page: number = 1;
  if (!pageParam) {
    urlParams.set("page", "1");
  }

  if (pageParam) {
    if (!isNaN(+pageParam)) {
      page = +pageParam;
      urlParams.set("page", pageParam);
    } else {
      urlParams.set("page", "1");
    }
  }

  const sortParam = urlParams.get("sort_type");
  if (!sortParam) {
    urlParams.set("sort_type", sortProduct.ASC);
  }

  if (sortParam) {
    if (isValidSort(sortParam)) {
      urlParams.set("sort_type", sortParam);
    } else {
      urlParams.set("sort_type", sortProduct.ASC);
    }
  }

  const sortByParam = urlParams.get("sort_by");
  if (!sortByParam) {
    urlParams.set("sort_by", productSortBy.ProductName);
  }

  if (sortByParam) {
    if (
      isValidSortBy(sortByParam, [
        productSortBy.ProductName,
      ])
    ) {
      urlParams.set("sort_by", sortByParam);
    } else {
      urlParams.set("sort_by", productSortBy.ProductName);
    }
  }

  const levelParam = urlParams.get("level");
  if (levelParam === "1") {
    urlParams.set("level", "1");
  }

  if (levelParam === "2") {
    urlParams.set("level", "2");
  }

  const {
    data: productRes,
    isLoading,
    mutate,
  } = useAPIFetcher<ProductPaginatedResponse>(
    `product/list?${urlParams.toString()}&limit=10&sort_by=name`,
    {
      accessToken: access_token,
    }
  );

  const {
    data: categoryRes,
  } = useAPIFetcher<CategoryPaginatedResponse>(
    `categories`,
    {
      accessToken: access_token,
    }
  );

  productRes?.data?.products.map((data) => {
    if (selectedProduct?.name === data.name) {
    }
  });

  if (isLoading) {
    return (
      <Flex
        className="h-full w-full"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Flex>
    );
  }

  const onNext = () => {
    urlParams.set("page", `${page + 1}`);
    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  const onPrev = () => {
    if (page === 1) return;
    urlParams.set("page", `${page - 1}`);
    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  const onClickRow = (rowData: TableData) => {
    const data = rowData as unknown as ProductRowData;
    router.push(`product/${convertToSlug(data.name)}`);
  };

  const addButtonClick = () => {
    router.push("product/add");
  };

  const onDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        await deleteProductBySlug(
          convertToSlug(selectedProduct.name),
          access_token
        );
        toast({
          title: "Delete Product",
          description: "Successfully deleted product",
          status: "success",
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
        mutate();
      }
    } catch (e) {
      toast({
        title: "Delete Product",
        description: "Delete product failed",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const actionColumn = (rowData: TableData) => {
    const data = rowData as unknown as ProductRowData;
    return (
      <Flex columnGap={4}>
        <Tooltip label="Delete product">
          <IconButton
            aria-label="delete product"
            colorScheme="red"
            onClick={(e) => {
              setSelectedProduct(data);
              onDeleteAlertOpen();
              e.stopPropagation();
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </IconButton>
        </Tooltip>
      </Flex>
    );
  };

  function handleSearch(searchTerm: string): void {
    urlParams.set("term", `${searchTerm}`);
    urlParams.set("page", "1");
    router.replace(`${pathname}?${urlParams.toString()}`);
  }

  return (
    <>
      <Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
        <Container maxW="100vw">
          <SearchAdmin
            Title="Product"
            ButtonName="New Product"
            onButtonClick={addButtonClick}
            onSearch={handleSearch}
            For="add"
          />
        </Container>
        <Flex>
          <Container
            maxW="20vw"
            paddingRight="0"
            marginLeft="20px"
            display="flex"
            flexDirection="column"
            gap="20px"
          >
            <CategoryPicker access_token={access_token} />
          </Container>
          <Container maxW={"80vw"}>
          <Flex gap={"25px"} flexDirection={"column"}>
            <ProductSortPicker />
            <Table
              columns={getProductTableColumn()}
              data={toProductTableData(productRes?.data?.products ?? [], categoryRes?.data?.categories ?? [])}
              onClickRow={onClickRow}
              actionColumn={actionColumn}
            />
            </Flex>
            <Flex
              columnGap={5}
              justifyContent={"center"}
              alignItems={"center"}
              marginTop={"20px"}
              marginBottom={"30px"}
            >
              {productRes?.data?.page_info.page_count &&
                productRes?.data?.page_info.page_count > 1 && (
                  <Paginator
                    onNext={onNext}
                    onPrev={onPrev}
                    pageInfo={productRes?.data?.page_info}
                  />
                )}
            </Flex>
          </Container>
        </Flex>
      </Flex>
      <Alert
        isOpen={isDeleteAlertOpen}
        onClose={onDeleteAlertClose}
        cancelRef={sendAlertCancelRef}
        header="Confirmation"
        onOK={onDeleteProduct}
      >
        <div>
          Are you sure to delete this product? <br />
        </div>
      </Alert>
    </>
  );
};

export default ProductTable;

const CategoryPicker = ({ access_token }: { access_token: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  

  const CategoryParam = urlParams.get("category_slug");

  if (!CategoryParam) {
    urlParams.set("category_slug", "");
  }

  const onCategoryChange = (nextValue: string) => {
    urlParams.set("category_slug", nextValue);
    urlParams.set("page", "1");
    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  const { data: categoryData } = useAPIFetcher<CategoryHierarchy[]>(
    `/categories/hierarchy`,
    {
      fallbackData: [],
    }
  );

  const hierarchies = categoryData?.data ?? []
  const [selectedCategory, selectCategory] = useState("");
  

  return (
    <Card width={"90%"} height={"auto"} className="shadow-2xl p-8">
    <Text fontSize={"18px"} fontWeight={"600"}>
      Category
    </Text>
    <Divider className="mt-4" color={`${colors.secondaryText}70`} />
    <Accordion allowToggle>
      <RadioGroup 
        name="category" 
        value={selectedCategory}
        onChange={(v) => onCategoryChange(v)}
        >
        <Radio size="md" value="all" pb={4} pt={4}>
          All Categories
        </Radio>
        {hierarchies.map(
          (hierarchy) => {
            const parent = hierarchy.parent;
            return (
              <AccordionItem key={parent.id}>
                <h2>
                  <AccordionButton>
                    <AccordionIcon />
                    <Box as="span" flex="1" textAlign="left">
                      {parent.name}
                    </Box>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pl={10}>
                  <Flex flexDirection={"column"}>
                    <Radio
                      size="md"
                      key={parent.id}
                      value={parent.slug}
                    >
                      {parent.name}
                    </Radio>
                    {hierarchy.childrens.map(
                      (subcategory) => (
                        <Radio
                          size="md"
                          key={subcategory.id}
                          value={subcategory.slug}
                        >
                          {subcategory.name}
                        </Radio>
                      )
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            )
          }
        )}
      </RadioGroup>
    </Accordion>
  </Card>
  );
};