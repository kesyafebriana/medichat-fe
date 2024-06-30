import Header from "@/components/ui/Header";
import SearchAdmin from "@/components/ui/SearchAdmin";
import TableAdmin, { TableColumn, TableData } from "@/components/ui/TableAdmin";
import {
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { colors } from "@/constants/colors";
import { createPharmacyManager, deletePharmacyManager, getPharmacyManager } from "@/services/partner";
import { SessionData, defaultSession } from "@/utils/session";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AddPartnerFields } from "@/types/validator/admin";
import { usePathname, useSearchParams } from "next/navigation";
import Paginator from "@/components/ui/Paginator";
import { PageInfo } from "@/types/responses";
import Alert from "@/components/modal/Alert";
import { getVerifyToken } from "@/services/auth";

const columns: TableColumn[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "profile_set", label: "Activation Status" },
  { key: "", label: "" },
];

const Page = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [partnerName, setPartnerName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>("DESC");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [profileFilter, setProfileFilter] = useState<string | undefined>();
  const itemsPerPage = 10;
  const toast = useToast();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPharmacyManagerList = async () => {
    try {
      const data = await getPharmacyManager(session.access_token, currentPage, itemsPerPage, "created_at", sortOrder != "DESC" ? "ASC" : "DESC", searchQuery, profileFilter == "all" ? undefined : profileFilter)
      setPageInfo(data?.data?.page_info)
      if (data?.data != undefined && data.data != null && data.data.page_info.item_count > 0) {
        const newTableData: TableData[] = [];
        data.data.pharmacy_managers.map((manager) => {
          const managers: TableData = {
            id: manager.account_id,
            email: manager.email,
            name: manager.name,
            profile_set: manager.profile_set.toString(),
            photo_url: manager.photo_url,
        }
          newTableData.push(managers)
        })
        setTableData(newTableData)
      }
    } catch (e) {
      
    }
  };

  useEffect(() => {    
    getPharmacyManagerList()
  }, [currentPage])

  useEffect(() => {    
    setCurrentPage(1)
    getPharmacyManagerList()
  }, [session.access_token, sortOrder, searchQuery, profileFilter])

  const addPharmacyManagerData = async (values: AddPartnerFields) => {
    try {
      setIsLoading(true)
      const req = {
        email: values.email,
        role: "pharmacy_manager"
      }
      await createPharmacyManager(req, session.access_token);

      toast({
        status: "success",
        title: "Pharmacy Manager Added Successfully",
        isClosable: true,
        position: "top-right",
        description: "The pharmacy manager has been successfully added.",
        icon: (
          <>
            <i className="fa-solid fa-circle-check"></i>
          </>
        ),
      });

      try {
        await getVerifyToken({
          email: values.email,
        });
        toast({
          title: "Email registered.",
          description: "Your partner has been informed to verify their account",
          status: "success",
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
  
        setPartnerName("")
        closeModal()
      } catch (e:any) {
        toast({
          title: "Server encounter error.",
          description: "failed to sent email verification",
          status: "error",
          isClosable: true,
          duration: 3000,
          position: "top-right",
        });
  
        setErrorMessage(e.message)
        setIsLoading(false)
      }
      setIsLoading(false)
    } catch (e:any) {
      setErrorMessage(e.message)
      setIsLoading(false)
    } 
  }

  const deletePharmacyManagerData = async () => {
    try {
      const req = {
        id: selectedId,
      }
      await deletePharmacyManager(req, session.access_token)
      toast({
        status: "success",
        title: "Pharmacy Manager Successfully Deleted",
        isClosable: true,
        description: "The pharmacy manager has been successfully deleted.",
        icon: (
          <>
            <i className="fa-solid fa-circle-check"></i>
          </>
        ),
      });
      setCurrentPage(1)
      getPharmacyManagerList();
    } catch (e:any) {
      toast({
        status: "error",
        title: "Delete Pharmacy Manager Failed",
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

  const onNext = () => {
		setCurrentPage(currentPage+1)
	};

	const onPrev = () => {
    setCurrentPage(currentPage-1)
	};

  const handlePartnerEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("")
    setPartnerName(event.target.value);
  };

  const handleSubmitButton = () => {
    addPharmacyManagerData({
      email: partnerName
    })
  }

  const {
		isOpen: isDeleteAlertOpen,
		onClose: onDeleteAlertClose,
		onOpen: onDeleteAlertOpen,
	} = useDisclosure();
	const deleteAlertCancelRef = React.useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = () => {
    openModal();
  };

  return (
    <main>
      <Header role="admin" />
      <Container maxW="100vw" marginTop="25px">
        <SearchAdmin
          Title="Partner"
          ButtonName="New Partner"
          onButtonClick={handleButtonClick}
          For="add"
          noSearch={true}
        />
      </Container>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Partner</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Text
                fontSize="18px"
                fontWeight="600"
                style={{ marginTop: "20px" }}
              >
                Partner&apos;s Email
              </Text>
              <Input
                type="text"
                value={partnerName}
                onChange={handlePartnerEmailChange}
                style={{
                  marginTop: "5px",
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                }}
              />
              {
                errorMessage != "" && <Flex justifyContent={"start"} w={"full"}>
                  <Text color={colors.danger} fontSize={"12px"}>{errorMessage}</Text>
                </Flex>
              }
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button bgColor={colors.primary} color={"white"} onClick={handleSubmitButton}>
                {
                  isLoading ? <Spinner /> : "Add"
                }
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Flex
        maxW="100vw"
        flexDirection="row"
        marginTop="25px"
        justifyContent="center"
      >
        <Container
          maxW="20vw"
          paddingRight="0"
          marginLeft="20px"
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          <Card
            width={"90%"}
            height={"auto"}
            className="shadow-2xl p-8"
            border="1px solid rgba(122,122,122,.5)"
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Sort By
            </Text>
            <Divider className="mt-4" color={"#333"} />
            <RadioGroup name="productForm" defaultValue="DESC" onChange={setSortOrder}>
              <Stack>
                <Radio size="sm" value="DESC">
                  Newest
                </Radio>
                <Radio size="sm" value="ASC">
                  Latest
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
          <Card
            width={"90%"}
            height={"auto"}
            className="shadow-2xl p-8"
            border="1px solid rgba(122,122,122,.5)"
          >
            <Text fontSize={"18px"} fontWeight={"600"}>
              Activation Status
            </Text>
            <Divider className="mt-4" color={"#333"} />
            <RadioGroup name="productForm" defaultValue="all" onChange={setProfileFilter}>
              <Stack>
                <Radio size="sm" value="all">
                  All
                </Radio>
                <Radio size="sm" value="true">
                  Active
                </Radio>
                <Radio size="sm" value="false">
                  Not Active
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
        </Container>
        <Container maxW="80vw" maxH="70vh" paddingLeft="0" marginRight="20px">
         {
          pageInfo && pageInfo.item_count > 0 ?  <TableAdmin
          columns={columns}
          data={tableData}
          onDetailButtonClick={function (rowData: TableData): void {
            if (typeof rowData.id === 'number') {
              
              setSelectedId(rowData.id as number);
              onDeleteAlertOpen();
            }
          }}
          buttonName="Delete"
        /> : <Flex justifyContent={"center"} alignItems={"center"}>
          <Text>Data Not Found</Text>
        </Flex>
         }
           {tableData && pageInfo && pageInfo.item_count > 0 && (
           <Flex columnGap={5} alignItems={"center"} className="mt-4">
           {
             <Paginator
               onNext={onNext}
               onPrev={onPrev}
               pageInfo={pageInfo}
             />
           }
         </Flex>
          )}
          <Alert
            isOpen={isDeleteAlertOpen}
            onClose={onDeleteAlertClose}
            cancelRef={deleteAlertCancelRef}
            header="Confirmation"
            onOK={deletePharmacyManagerData}
            okButtonColorScheme="red"
          >
				Are you sure to delete this pharmacy manager?
			</Alert>
        </Container>
      </Flex>
    </main>
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
