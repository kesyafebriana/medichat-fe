import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { postChatImage, postChatText } from "@/services/chats";
import { useAppSelector } from "@/redux/reduxHook";

interface SendButtonProps {
  roomId: string;
  scroll: React.MutableRefObject<HTMLDivElement | undefined>;
}

const ChatField = ({ roomId, scroll }: SendButtonProps) => {
  const profileState = useAppSelector((state) => state.profile);
  const [message, setMessage] = useState("");
  const [changed, setChanged] = useState(false);
  const roomRef = doc(db, "rooms", roomId);
  const toast = useToast();

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    try {
      await postChatText(
        roomId,
        () => {
          setMessage("");
        },
        message,
        profileState.id.toString(),
        profileState.name
      );
    } catch (e) {
      toast({
        status: "error",
        title: "Message Failed to be sent",
        isClosable: true,
        description: "Please try again in a few moments.",
        icon: (
          <>
            <i className="fa-solid fa-circle-xmark"></i>
          </>
        ),
      });
    }
  }

  async function sendImage(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    if ((event.target.files?.length ?? 0) > 0) {
      const res = postChatImage(
        roomId,
        () => {
          setMessage("");
          scroll.current?.scrollIntoView({ behavior: "smooth" });
        },
        event.target.files!,
        profileState.id.toString(),
        profileState.name
      );
      await toast.promise(res, {
        success: {
          title: "File is Sent Sucessfully",
          icon: (
            <>
              <i className="fa-solid fa-circle-check"></i>
            </>
          ),
          position: "top-right",
          isClosable: true,
        },
        error: {
          title: "File Upload Failed",
          isClosable: true,
          description:
            "Please Make sure that the file is less than 5 Mb and has type of PNG/JPG/JPEG/PDF only",
          icon: (
            <>
              <i className="fa-solid fa-circle-xmark"></i>
            </>
          ),
        },
        loading: {
          title: "File is Being Sent",
          description: "Please wait",
          position: "top-right",
        },
      });
    } else {
      toast({
        status: "error",
        title: "No File To Be Sent",
        icon: (
          <>
            <i className="fa-solid fa-circle-xmark"></i>
          </>
        ),
      });
    }
  }

  const setStatus = async () => {
    console.log("setStatus");
    setChanged(true);
    await updateDoc(roomRef, {
      isTyping: arrayUnion("User1"),
    });
  };

  useEffect(() => {
    const removeStatus = async () => {
      setChanged(false);
      await updateDoc(roomRef, {
        isTyping: arrayRemove("User1"),
      });
    };

    const getData = setTimeout(() => removeStatus(), 2000);

    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={(event) => sendMessage(event)}>
      <InputGroup className="px-4 my-4 ">
        <Input
          type="text"
          placeholder="Start Typing..."
          value={message}
          paddingRight={"120px"}
          onChange={(e) => {
            if (!changed) {
              setStatus();
            }
            setMessage(e.target.value);
          }}
        />
        <InputRightElement width={"120px"} justifyContent={"space-evenly"}>
          <Box>
            <Input
              onChange={async (e) => {
                console.log(e.target.files?.length);
                sendImage(e);
              }}
              type="file"
              height="100%"
              width="100%"
              position="absolute"
              top="0"
              left="0"
              hidden
              aria-hidden="true"
              multiple
              accept="image/*, application/pdf"
              ref={fileInputRef}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              aria-label="attachment"
              variant="ghost"
              fontSize={18}
              icon={<i className="fa-solid fa-paperclip" />}
            />
          </Box>

          <IconButton
            type="submit"
            aria-label="send"
            variant="ghost"
            colorScheme="blue"
            fontSize={18}
            icon={<i className="fa-regular fa-paper-plane" />}
          />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default ChatField;
