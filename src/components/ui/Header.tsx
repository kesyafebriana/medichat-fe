import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import HeaderItem from "./HeaderItem";
import HeaderButton from "./HeaderButton";
import HeaderDrawer from "./HeaderDrawer";
import Link from "next/link";

interface HeaderItf {
  role: string;
}

function Header({ role }: HeaderItf): React.ReactElement {
  return (
    <Flex
      className="bg-white h-20 lg:h-24 max-w-screen w-full px-8 lg:px-16 shadow-md sticky top-0 z-50"
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        className="w-max"
        gap={"30px"}
      >
        <Link href={"/home"}>
          <Image src={Logo} alt="Medichat Logo" className="w-48" />
        </Link>
        <Box className="hidden lg:block">
          <HeaderItem role={role} />
        </Box>
      </Flex>
      <Box className="hidden lg:block">
        <HeaderButton role={role} />
      </Box>
      <Box className="block lg:hidden">
        <HeaderDrawer role={role} />
      </Box>
    </Flex>
  );
}

export default Header;
