import { colors } from "@/constants/colors";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

type IconType = {
    icon:string;
}

function FooterSocialCircle({icon}:IconType): React.ReactElement {
  return (
    <Box
      bg={colors.secondary}
      width={"35px"}
      height={"35px"}
      className="rounded-full hover:shadow-lg"
    >
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        className="w-full h-full"
      >
        <Text color={colors.primary}>
          <i className={icon}></i>
        </Text>
      </Flex>
    </Box>
  );
}

export default FooterSocialCircle;
