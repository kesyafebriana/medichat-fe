import { Message as MessageBubble, Message } from "@/types/message";
import { Room } from "@/types/room";
import { Card, Image } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

interface ChatDateProps {
  date: Dayjs;
}

const ChatDate = ({ date }: ChatDateProps) => {
  return (
    <div className={`w-full justify-center flex`}>
      <Card
        backgroundColor={"white"}
        className={`rounded-lg relative max-w-[45%] w-fit p-4 px-6`}
      >
        <p className="">{date.format("ddd, DD MMMM YYYY")}</p>
      </Card>
    </div>
  );
};

export default ChatDate;
