import { colors } from '@/constants/colors'
import { toRupiah } from '@/utils/convert'
import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface FloatingCartItf {
    cartQuantity: number
    cartTotal: number
}

function FloatingCart({cartQuantity, cartTotal}:FloatingCartItf):React.ReactElement {
  return (
        <Flex
          className="fixed bottom-0 right-0 z-50"
          alignItems={"center"}
          width={cartQuantity > 0 ? "190px" : "100px"}
          height={"100px"}
        >
          {cartQuantity > 0 ? (
            <Link href={"/cart"}>
              <Box
                className="flex px-5 justify-center items-center relative shadow-2xl"
                height={"60px"}
                borderRadius={"20px"}
                bg={colors.primary}
                color={colors.white}
                fontSize={"20px"}
                width={"165px"}
              >
                <Box
                  fontSize={"16px"}
                  className="rounded-full p-1 flex justify-center items-center"
                  pos={"absolute"}
                  top={"-2"}
                  left={"-2"}
                  width={"25px"}
                  height={"25px"}
                  bg={colors.warning}
                  fontWeight={600}
                >
                  {cartQuantity}
                </Box>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  w={"full"}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  <Flex flexDirection={"column"}>
                    <Text fontWeight={600} fontSize={"15px"}>
                      Total
                    </Text>
                    <Text fontSize={"15px"}>{toRupiah(cartTotal)}</Text>
                  </Flex>
                </Flex>
              </Box>
            </Link>
          ) : (
            <Link href={"/cart"}>
              <Box
                className="rounded-full flex justify-center items-center"
                width={"60px"}
                height={"60px"}
                bg={colors.primary}
                color={colors.white}
                fontSize={"20px"}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </Box>
            </Link>
          )}
        </Flex>
  )
}

export default FloatingCart