import { colors } from "@/constants/colors";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useSession from "@/hooks/useSession";
import {
  OrderPaginatedResponse,
  defaultOrderPaginatedResponse,
} from "@/types/responses/order";
import {
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserTransactionItem from "../ui/UserTransactionItem";
import Paginator from "../ui/Paginator";

const TransactionHistory = () => {
  const { session } = useSession();
  const [page, setPage] = useState(1);
  const { data: ordersData } = useAPIFetcher<OrderPaginatedResponse>(
    `/orders?limit=5&page=${page}`,
    {
      accessToken: session?.access_token,
      requireToken: true,
    }
  );
  const { orders, page_info } =
    ordersData?.data ?? defaultOrderPaginatedResponse;

  const onNext = () => {
    setPage(page+1)
  };
  
  const onPrev = () => {
    setPage(page-1)
  };

  return (
    <>
      <Card
        width={"full"}
        size={"2xl"}
        className="p-8"
        borderRadius={"8px"}
        color={`${colors.primaryText}90`}
      >
        <Flex flexDirection={"column"} gap={"20px"}>
          <Text color={colors.primaryText} fontSize={"20px"} fontWeight={600}>
            Transaction History
          </Text>
          <Divider />
          {
            orders.length > 0 ? <>
            <Box>
            {orders?.map((order) => (
                <UserTransactionItem order={order} key={order.id} />
              ))}
          </Box>
          <Divider />
          <Flex className="items-center justify-center w-full gap-5">
            <Paginator
              pageInfo={page_info}
              onNext={onNext}
              onPrev={onPrev}
            />
          </Flex></> :
          <Text className="text-center">You have no transaction</Text>
          }
        </Flex>
      </Card>
    </>
  );
};

export default TransactionHistory;
