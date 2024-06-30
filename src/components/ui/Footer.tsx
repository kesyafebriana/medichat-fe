import { colors } from "@/constants/colors";
import { Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";
import LogoDark from "../../../public/assets/img/logo_dark.png";
import Image from "next/image";
import Link from "next/link";
import FooterInfo from "./FooterInfo";
import FooterSocialCircle from "./FooterSocialCircle";

function Footer(): React.ReactElement {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <Flex
      className="max-w-screen lg:h-96 px-16 py-8"
      bg={colors.primary}
      flexDirection={"column"}
      justifyContent={"space-between"}
      gap={{base:"30px",lg:"0px"}}
    >
      <Flex justifyContent={"space-between"} flexDirection={{base:"column", lg:"row"}} gap={{base:"30px",lg:"0px"}}>
        <Flex flexDirection={"column"} gap={"30px"}>
          <Link href={"/home"}>
            <Image src={LogoDark} alt="Medichat Logo" className="w-60" />
          </Link>
          <Flex flexDirection={"column"} gap={"15px"}>
            <FooterInfo />
            <Flex gap={"15px"}>
              <Link href={"#"}>
                <FooterSocialCircle icon="fa-brands fa-facebook-f" />
              </Link>
              <Link href={"#"}>
                <FooterSocialCircle icon="fa-brands fa-twitter" />
              </Link>
              <Link href={"#"}>
                <FooterSocialCircle icon="fa-brands fa-youtube" />
              </Link>
              <Link href={"#"}>
                <FooterSocialCircle icon="fa-brands fa-tiktok" />
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
      <Text color={colors.white}>
        Copyright © {year} Medichat. All Rights Reserved.
      </Text>
    </Flex>
  );
}

export default Footer;
