import { IconButton, Spinner, Tooltip, useDisclosure } from "@chakra-ui/react";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import Table from "../ui/Table";
import Paginator from "../ui/Paginator";
import Alert from "../modal/Alert";
import {
  CategoryLevel,
  CategoryRowData,
  getCategoryTableColumn,
  toCategoryTableData,
} from "@/types/table/category";
import { CategoryPaginatedResponse } from "@/types/responses/category";
import {
  addCategory,
  addCategoryLevel2,
  deleteCategoriesBySlug,
  getCategories,
} from "@/services/admin";
import React, { useState } from "react";
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
import {
  AddCategoryFields,
  AddCategoryFieldsLevel2,
} from "@/types/validator/admin";
import { convertToSlug } from "@/utils/convert";
import { serverEncounterError } from "@/constants/error";
import { useFormState } from "@/hooks/useFormState";
import { usePathname, useSearchParams } from "next/navigation";

const CategoryTable = ({ access_token }: { access_token: string }) => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null);
  const [level1Input, setLevel1Input] = useState<string>("");
  const [level2Input, setLevel2Input] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<CategoryRowData>();
  const [selectedLevel1Slug, setSelectedLevel1Slug] = useState<
    string | undefined
  >(undefined);
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

  const sortParam = urlParams.get("sort");
  if (!sortParam) {
    urlParams.set("sort", sort.ASC);
  }

  if (sortParam) {
    if (isValidSort(sortParam)) {
      urlParams.set("sort", sortParam);
    } else {
      urlParams.set("sort", sort.ASC);
    }
  }

  const sortByParam = urlParams.get("sort_by");
  if (!sortByParam) {
    urlParams.set("sort_by", categorySortBy.CategoryName);
  }

  if (sortByParam) {
    if (
      isValidSortBy(sortByParam, [
        categorySortBy.CategoryName,
        categorySortBy.Level,
        categorySortBy.Parent,
      ])
    ) {
      urlParams.set("sort_by", sortByParam);
    } else {
      urlParams.set("sort_by", categorySortBy.CategoryName);
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
    data: categoryRes,
    isLoading,
    mutate,
  } = useAPIFetcher<CategoryPaginatedResponse>(
    `categories?${urlParams.toString()}&limit=10`,
    {
      accessToken: access_token,
    }
  );

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
    const data = rowData as unknown as CategoryRowData;
    router.push(`categories/${convertToSlug(data.category_name)}`);
  };

  const handleSubmitButton = () => {
    if (selectedLevel === "level1" && level1Input.trim() !== "") {
      const formData = {
        name: level1Input,
      };
      addCategoryData(formData);
    } else if (selectedLevel === "level2") {
      const formData = {
        name: level2Input,
      };
      addCategoryDataLevel2(formData);
    }
  };

  const resetModal = () => {
    setSelectedLevel(null);
    setSelectedLevel2(null);
    setLevel1Input("");
    setLevel2Input("");
  };

  const addCategoryData = async (values: AddCategoryFields) => {
    try {
      onLoading();
      await addCategory(access_token, values);
      toast({
        title: "Create Category",
        description: "Successfully created category",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      mutate();
      closeModal();
      resetModal();
    } catch (e) {
      toast({
        title: "Create Category",
        description: `Create category failed  because ${e}`,
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const addCategoryDataLevel2 = async (values: AddCategoryFieldsLevel2) => {
    try {
      onLoading();
      await addCategoryLevel2(
        access_token,
        values,
        selectedLevel1Slug as string
      );
      toast({
        title: "Create Category",
        description: "Successfully created category",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
      mutate();
      closeModal();
      resetModal();
    } catch (e) {
      toast({
        title: "Create Category",
        description: `Create category failed because ${e}`,
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addButtonClick = () => {
    openModal();
  };

  const onDeleteCategory = async () => {
    try {
      if (selectedCategory) {
        await deleteCategoriesBySlug(
          convertToSlug(selectedCategory.category_name),
          access_token
        );
        toast({
          title: "Delete Category",
          description: "Successfully deleted category",
          status: "success",
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
        mutate();
      }
    } catch (e) {
      toast({
        title: "Delete Category",
        description: `Delete category failed because ${e}`,
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const actionColumn = (rowData: TableData) => {
    const data = rowData as unknown as CategoryRowData;
    return (
      <Flex columnGap={4}>
        <Tooltip label="Delete category">
          <IconButton
            aria-label="delete category"
            colorScheme="red"
            onClick={(e) => {
              setSelectedCategory(data);
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

  const onChooseCategories = (newValue: SingleValue<string>) => {
    const v = newValue as unknown as { value: string; label: string };
    console.log(v.value);
    setSelectedLevel1Slug(v.value);
  };

  return (
    <>
      <Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
        <Container maxW="100vw">
          <SearchAdmin
            Title="Category"
            ButtonName="New Category"
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
            <CategoryLevelPicker />
          </Container>
          {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add New Category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text fontSize="18px" fontWeight="600">
                    Choose Level
                  </Text>
                  <Select onChange={(e) => setSelectedLevel(e.target.value)}>
                    <option value="" hidden selected>
                      Choose Level
                    </option>
                    <option value="level1">Level 1</option>
                    <option value="level2">Level 2</option>
                  </Select>
                  {selectedLevel === "level1" && (
                    <>
                      <Text fontSize="18px" fontWeight="600" marginTop="20px">
                        Level 1
                      </Text>
                      <Input
                        placeholder="Enter new category level 1"
                        value={level1Input}
                        onChange={(e) => setLevel1Input(e.target.value)}
                      />
                    </>
                  )}
                  {selectedLevel === "level2" && (
                    <>
                      <Text fontSize="18px" fontWeight="600" marginTop="20px">
                        Level 1
                      </Text>
                      <Level1Picker onChange={onChooseCategories} />
                      <Text fontSize="18px" fontWeight="600" marginTop="20px">
                        Level 2
                      </Text>
                      <Input
                        placeholder="Enter Level 2"
                        value={level2Input}
                        onChange={(e) => setLevel2Input(e.target.value)}
                      />
                    </>
                  )}
                </ModalBody>
                <ModalFooter justifyContent="center">
                  <Button
                    bgColor={colors.primary}
                    color={"white"}
                    onClick={handleSubmitButton}
                    _hover={{ bg: "#0057FF" }}
                    isDisabled={
                      !selectedLevel ||
                      (selectedLevel === "level1" && !level1Input.trim()) ||
                      (selectedLevel === "level2" &&
                        (selectedLevel2 === "" || !level2Input.trim()))
                    }
                  >
                    Add
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
          <Container maxW={"80vw"}>
            <Flex gap={"25px"} flexDirection={"column"}>
            <CategorySortPicker />
            <Table
              columns={getCategoryTableColumn("1" as CategoryLevel)}
              data={toCategoryTableData(categoryRes?.data?.categories ?? [])}
              onClickRow={onClickRow}
              actionColumn={actionColumn}
            />
            </Flex>
            <Flex
              columnGap={5}
              alignItems={"center"}
              marginTop={"20px"}
              marginBottom={"30px"}
              justifyContent={"center"}
            >
              {categoryRes?.data?.page_info.page_count &&
                categoryRes?.data?.page_info.page_count > 1 && (
                  <Paginator
                    onNext={onNext}
                    onPrev={onPrev}
                    pageInfo={categoryRes?.data?.page_info}
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
        onOK={onDeleteCategory}
      >
        <div>
          Are you sure to delete category? <br />
          (If you delete a level 1 category, all its children will also be
          deleted.)
        </div>
      </Alert>
    </>
  );
};

export default CategoryTable;

const CategoryLevelPicker = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);

  const levelParam = urlParams.get("level");

  if (!levelParam) {
    urlParams.set("level", "");
  }

  if (levelParam) {
    if (levelParam === "1") {
      urlParams.set("status", "1");
    } else {
      urlParams.set("status", "2");
    }
  }

  const onLevelChange = (nextValue: string) => {
    urlParams.set("level", nextValue);
    urlParams.set("page", "1");
    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  return (
    <Card
      width={"90%"}
      height={"auto"}
      className="shadow-2xl p-8"
      border="1px solid rgba(122,122,122,.5)"
    >
      <Text fontSize={"18px"} fontWeight={"600"}>
        Category Level
      </Text>
      <Divider className="my-4" color={"#333"} />
      <RadioGroup
        name="productForm"
        defaultValue={urlParams.get("level") ?? "12"}
        onChange={onLevelChange}
      >
        <Stack>
          <Radio size="sm" value={""}>
            {"All"}
          </Radio>
          <Radio size="sm" value={"1"}>
            {"Level 1"}
          </Radio>
          <Radio size="sm" value={"2"}>
            {"Level 2"}
          </Radio>
        </Stack>
      </RadioGroup>
    </Card>
  );
};

import { AsyncSelect, SingleValue } from "chakra-react-select";
import * as _ from "lodash";
import useSession from "@/hooks/useSession";
import { sort, categorySortBy } from "@/constants/params";
import { isValidSort, isValidSortBy } from "@/utils/checker";
import StockSortPicker from "../ui/StockSortPicker";
import CategorySortPicker from "../ui/CategorySortPicker";

export const Level1Picker = ({
  onChange,
  placeholder = "Choose category level 1",
}: Level1PickerProps) => {
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
                1
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

interface Level1PickerProps {
  placeholder?: string;
  onChange: (newValue: SingleValue<string>) => void;
}
