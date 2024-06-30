import { MessageType } from "@/constants/message_type";
import { Message } from "@/types/message";
import { Room } from "@/types/room";
import {
  Button,
  Card,
  Divider,
  Image,
  Skeleton,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { create } from "domain";
import React, { lazy } from "react";
import { theme } from "../../styles/theme/index";
import { getPharmaciesByProductSlugClosest } from "@/services/pharmacy";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook";
import { addOrder, resetCart } from "@/redux/slice/cartSlice";
import { getUserProfile } from "@/services/profile";
import { unsealData } from "iron-session";
import { SessionData } from "@/utils/session";
import {
  AccountProfile,
  defaultGetUserProfile,
} from "@/types/responses/profile";
import { getProductBySlug } from "@/services/product";
import { defaultPharmacyPaginatedResponse } from "@/types/responses/pharmacy";
import { role } from "@/constants/role";
import router from "next/router";

interface MessageProps {
  message: Message;
  roleUser: string;
  room: Room;
  session: SessionData;
  userId: number;
}

interface PrescriptionDrug {
  ProductId: number;
  Direction: string;
  Count: number;
  Picture: string;
  Slug: string;
  Name: string;
}

const MessageBubble = ({
  session,
  roleUser,
  room,
  message,
  userId,
}: MessageProps) => {
  const createdAt = message.createdAt.toDate();

  const dispatch = useAppDispatch();

  let previewUrl = "";

  var prescriptionDrugs: PrescriptionDrug[] = [];

  if (message.type === MessageType.pdf) {
    previewUrl = message.url;
    previewUrl = previewUrl.replace(
      RegExp("(image/upload/)"),
      "image/upload/c_thumb,h_200,ar_2,g_north/"
    );
    previewUrl = previewUrl.replace(RegExp(".pdf$"), ".png");
  }
  if (message.type === MessageType.prescription) {
    var data = JSON.parse(message.message);
    var drugs = data["drugs"];
    prescriptionDrugs = (drugs as any[])?.map((drug, i) => {
      return {
        ProductId: drug.id as number,
        Direction: drug.direction as string,
        Slug: drug.slug as string,
        Count: drug.count as number,
        Picture: drug.picture as string,
        Name: drug.name as string,
      };
    });
  }

  return (
    <div
      className={`w-full ${
        userId != message.userId ? "justify-start" : "justify-end"
      } flex`}
    >
      <Card
        textColor={userId != message.userId ? "black" : "white"}
        backgroundColor={userId != message.userId ? "white" : "#2563eb"}
        className={`rounded-lg relative max-w-[45%] w-fit p-4 px-6`}
      >
        {message.type === MessageType.message ? (
          <p className="">{message.message}</p>
        ) : message.type === MessageType.image ? (
          <Image
            alt={message.id}
            src={message.url}
            fallback={
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.200"
                size="xl"
                className="m-auto"
              />
            }
          />
        ) : message.type === MessageType.pdf ? (
          <Stack
            className="cursor-pointer"
            onClick={() => {
              open(message.url);
            }}
          >
            <Image
              alt={message.id}
              src={previewUrl}
              fallback={
                <Spinner
                  thickness="2px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.200"
                  size="xl"
                  className="m-auto"
                />
              }
            ></Image>
            <div
              className="flex-row flex gap-2"
              style={{
                alignItems: "center",
              }}
            >
              <i className="fa-solid fa-file-pdf text-2xl" />
              <p className="flex-1 flex-wrap overflow-hidden">
                {message.message}
              </p>
            </div>
          </Stack>
        ) : message.type === MessageType.prescription ? (
          <div
            className="flex-col flex gap-2 w-full"
            style={{
              alignItems: "center",
            }}
          >
            <p className="text-2xl font-bold text-left w-full">Prescription</p>
            <div>
              {prescriptionDrugs?.length > 0 ? (
                prescriptionDrugs.map((drug) => {
                  return (
                    <>
                      <div className="flex-col flex gap-2 w-[100%] bg-white text-black p-4 rounded-lg">
                        <div
                          className="flex-row flex justify-around "
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Image
                            className="w-16 h-w-16 aspect-square"
                            alt={drug.Name}
                            src={drug.Picture}
                            fallback={
                              <Spinner
                                thickness="2px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.200"
                                size="xl"
                                className="m-auto"
                              />
                            }
                          />
                          <div className="flex-col gap-2 text-right">
                            <p className="font-bold">{drug.Name}</p>
                            <p className="">{drug.Count} pcs</p>
                          </div>
                        </div>
                        <p>Dosage : {drug.Direction}</p>
                      </div>
                      <Divider className="mt-2 mb-4" />
                    </>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            {roleUser !== role.DOCTOR ? (
              <Button
                width={"100%"}
                onClick={async () => {
                  const userProfileRes = await getUserProfile(
                    session.access_token
                  );
                  const userProfile =
                    userProfileRes?.data ?? defaultGetUserProfile;

                  dispatch(resetCart(userProfile.user.id));

                  for (
                    let index = 0;
                    index < prescriptionDrugs.length;
                    index++
                  ) {
                    const element = prescriptionDrugs[index];

                    const product = await getProductBySlug(
                      element.Slug,
                      session.access_token
                    );

                    const coordinate = userProfile.user.locations.find(
                      (loc) => loc.id == userProfile.user.main_location_id
                    )?.coordinate ?? { lat: 0, lon: 0 };

                    const pharmacies = await getPharmaciesByProductSlugClosest(
                      element.Slug,
                      coordinate.lon,
                      coordinate.lat
                    );

                    const pharma =
                      pharmacies?.data ?? defaultPharmacyPaginatedResponse;

                    if (pharma.pharmacies) {
                      dispatch(
                        addOrder({
                          account_id: userProfile.id,
                          user_id: userProfile.user.id,
                          product_slug: element.Slug,
                          pharmacy_slug: pharma.pharmacies[0].slug ?? "",
                          amount: element.Count,
                        })
                      );
                    }
                    router.push(`cart`);
                  }
                }}
              >
                Add to Cart
              </Button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        <p
          className={`absolute  
          ${userId != message.userId ? " right-0 " : " left-0 "}
           text-black bottom-0 `}
          style={{
            transform: `translate(${
              userId != message.userId ? "120%" : "-120%"
            },0%)`,
          }}
        >
          {message.createdAt ? dayjs(createdAt).format("HH.mm") : ""}
        </p>
      </Card>
    </div>
  );
};

export default MessageBubble;
