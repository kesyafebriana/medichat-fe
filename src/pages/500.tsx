import { Flex, Text } from "@chakra-ui/react";
import Logo from "../../public/assets/svg/logo.svg";
import Sorry from "../../public/assets/img/sorry.png";
import Image from "next/image";
import Link from "next/link";

export default function Page404() {
  return (
    <Flex flexDirection={"column"} h={"100vh"}>
      <Flex
        className="bg-white min-h-20 lg:min-h-24 max-w-screen w-full px-8 lg:px-16 shadow-md top-0 z-50 sticky"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Link href={"/home"}>
          <Image src={Logo} alt="Medichat Logo" className="w-48" />
        </Link>
      </Flex>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        height={"full"}
        w={"full"}
        gap={"24px"}
        flexDirection={{ base: "column", lg: "row" }}
        className="px-8 lg:px-16"
      >
        <Image src={Sorry} alt="Sorry" />
        <Flex
          gap={"30px"}
          flexDirection={"column"}
          w={"500px"}
          alignItems={{ base: "center", lg: "start" }}
        >
          <Text fontSize={"72px"} fontWeight={600}>
            500
          </Text>
          <Text fontSize={"24px"} fontWeight={600}>
            Sorry! An error occured.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
