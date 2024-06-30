import { colors } from "@/constants/colors";
import { OrderResponse } from "@/types/responses/order";
import { formatDate, getStatusColor } from "@/utils/order";
import { Flex, Divider, Badge, Box, Text } from "@chakra-ui/react";
import Link from "next/link";

interface UserTransactionItemProps {
  order: OrderResponse;
}

export default function UserTransactionItem({
  order,
}: UserTransactionItemProps) {
  return (
    <Link href={`order/${order.id}`}>
      <Box
        w={"full"}
        border={`1px solid ${colors.primaryText}20`}
        borderRadius={"8px"}
        padding={"10px"}
        className="flex flex-col gap-2"
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text color={colors.primaryText} fontWeight={600}>
            Order
          </Text>
          <Text fontSize={"14px"} color={colors.primaryText} fontWeight={600}>
            Order ID
          </Text>
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text color={colors.secondaryText} fontSize={"14px"}>
            {formatDate(new Date(order.ordered_at))}
          </Text>
          <Text fontSize={"14px"} color={colors.secondaryText}>
            {order.id}
          </Text>
        </Flex>
        <Divider color={colors.primaryText} />
        <Flex
          justifyContent={"space-between"}
          gap={"16px"}
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
            <Text color={colors.primaryText} fontSize={"14px"} fontWeight={600}>
              Products
            </Text>
            <Text fontSize={"14px"} color={colors.secondaryText}>
              {order.n_items} items
            </Text>
          </Flex>
          <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
            <Text color={colors.primaryText} fontSize={"14px"} fontWeight={600}>
              Address
            </Text>
            <Flex gap={"10px"} alignItems={"center"}>
              <Text color={colors.secondaryText} fontSize={"14px"}>
                <i className="fa-solid fa-location-dot"></i>
              </Text>
              <Text color={colors.secondaryText} fontSize={"14px"}>
                {order.address}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
            <Text color={colors.primaryText} fontSize={"14px"} fontWeight={600}>
              Status
            </Text>
            <Flex gap={"10px"} alignItems={"center"}>
              <Badge
                color={getStatusColor(order.status)}
                bg={`${getStatusColor(order.status)}20`}
              >
                {order.status.toUpperCase()}
              </Badge>
            </Flex>
          </Flex>
          <Flex flexDirection={"column"} gap={"5px"} width={"100%"}>
            <Text color={colors.primaryText} fontSize={"14px"} fontWeight={600}>
              Total
            </Text>
            <Text color={colors.primaryText}>
              Rp {order.total.toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
}
