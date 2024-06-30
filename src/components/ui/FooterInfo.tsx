import { colors } from "@/constants/colors";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function FooterInfo(): React.ReactElement {
  return (
    <Flex flexDirection={"column"} gap={"8px"}>
      <Link
        href={
          "https://www.google.com/maps/place/Jakarta/@-6.2297236,106.6736255,12z/data=!3m1!4b1!4m6!3m5!1s0x2e69f3e945e34b9d:0x5371bf0fdad786a2!8m2!3d-6.1944491!4d106.8229198!16zL20vMDQ0cnY?entry=ttu"
        }
        target="_blank"
      >
        <Text color={colors.white} className="hover:text-[#DEE9FF]">
          Jl. Bareng Tapi Gak Jadian No 48, Jakarta Selatan, Indonesia
        </Text>
      </Link>
      <Link href={`tel:+62812345567890`} target="_blank">
        <Text color={colors.white} className="hover:text-[#DEE9FF]">
          +62 81234567890
        </Text>
      </Link>
      <Link href={`mailto:medichat@medichat.com`} target="_blank">
        <Text color={colors.white} className="hover:text-[#DEE9FF]">
          medichat@medichat.com
        </Text>
      </Link>
    </Flex>
  );
}

export default FooterInfo;
