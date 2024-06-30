import { colors } from "@/constants/colors";
import { Card, Flex, Text } from "@chakra-ui/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface HomepageCardItf {
  img: StaticImageData;
  title: string;
  desc: string;
  link: string;
}

function HomepageCard({
  img,
  title,
  desc,
  link,
}: HomepageCardItf): React.ReactElement {
  return (
    <Link href={link}>
      <Card
        size={"md"}
        h={{base:"100%", lg:"274px"}}
        w={{base:"auto", lg:"560px"}}
        className="shadow-lg relative p-8"
      >
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          gap={"10px"}
          className="w-3/5 lg:w-1/2 h-full"
        >
          <Text
            fontSize={{base:"20px", lg:"32px"}}
            fontWeight={"600"}
            color={colors.primary}
            className="w-5/6"
          >
            {title}
          </Text>
          <Text
            fontSize={{base:"12px", lg:"16px"}}
            color={colors.secondaryText}
            className="w-11/12"
          >
            {desc}
          </Text>
        </Flex>
        <Image
          src={img}
          alt="Doctor Illustration"
          className="absolute bottom-0 right-0 w-6/12 lg:w-7/12"
        />
      </Card>
    </Link>
  );
}

export default HomepageCard;
