import { colors } from "@/constants/colors";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import HeaderItem from "./HeaderItem";
import HeaderButton from "./HeaderButton";

function HeaderDrawer({ role }: HeaderPropsType): React.ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant={"brandPrimary"}
        bg={"transparent"}
        onClick={onOpen}
      >
        <Text fontSize={"20px"} color={colors.primary}>
          <i className="fa-solid fa-bars" color={colors.primary}></i>
        </Text>
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <HeaderItem role={role} />
          </DrawerBody>
          <DrawerFooter>
            <HeaderButton role={role} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default HeaderDrawer;
