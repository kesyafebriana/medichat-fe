import Header from "@/components/ui/Header";
import Pagination from "@/components/ui/Pagination";
import Paginator from "@/components/ui/Paginator";
import SearchAdmin from "@/components/ui/SearchAdmin";
import TableAdmin, { TableColumn, TableData } from "@/components/ui/TableAdmin";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { getOrders } from "@/services/admin";
import { PageInfo } from "@/types/responses";
import { Payments } from "@/types/responses/admin";
import { convertToSlug, toRupiah } from "@/utils/convert";
import { SessionData, defaultSession } from "@/utils/session";
import {
  Card,
  Container,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { unsealData } from "iron-session";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import router from "next/router";
import React, { useEffect, useState } from "react";

const columns: TableColumn[] = [
  { key: "order_id", label: "Payment ID" },
  { key: "invoice_number", label: "Invoice Number" },
  { key: "user_fullname", label: "User's Fullname" },
  { key: "total_payment", label: "Total Payment" },
  { key: "order_status", label: "Confirmation Status" },
  { key: "", label: "" },
];

const Page = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string>();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const getOrderList = async () => {
    const data = await getOrders(session.access_token, currentPage, 10, status == "all" ? undefined : status)
    setPageInfo(data?.data?.page_info)
    if (data?.data != undefined) {
      const newTableData: TableData[] = [];
      data.data.payments.map((order:Payments) => {
        const orders: TableData = {
          order_id: order.id,
          invoice_number: order.invoice_number,
          user_fullname: order.user.name,
          total_payment: toRupiah(parseInt(order.amount)),
          order_status: order.is_confirmed.toString(),
      }
        newTableData.push(orders)
      })
      setTableData(newTableData)
    }
  };

  useEffect(() => {
    getOrderList()
  }, [session.access_token, currentPage]);

  useEffect(() => {
    setCurrentPage(1)
    getOrderList()
  }, [status]);
  
  function onDetailButtonClick(rowData: TableData): void {
    router.push(`orders/${rowData.invoice_number as string}`);
  }

  const onNext = () => {
		setCurrentPage(currentPage+1)
	};

	const onPrev = () => {
    setCurrentPage(currentPage-1)
	};

  return (
    <main>
      <Header role="admin" />
      <Container maxW="100vw" marginTop="25px">
        <SearchAdmin
          Title="Order"
          noSearch={true}
        />
      </Container>
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
              Confirmation Status
            </Text>
            <Divider className="mt-4" color={"#333"} />
            <RadioGroup name="productForm" defaultValue="all" onChange={setStatus}>
              <Stack>
                <Radio size="sm" value="all">
                  All
                </Radio>
                <Radio size="sm" value="true">
                  Confirmed
                </Radio>
                <Radio size="sm" value="false">
                  Need Confirmation
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
        </Container>
        <Container maxW="80vw" maxH="70vh" paddingLeft="0" marginRight="20px">
          <TableAdmin
            columns={columns}
            data={tableData}
            onDetailButtonClick={onDetailButtonClick}
          />
          {tableData && (
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
