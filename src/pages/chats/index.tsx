import Layout from "@/layouts/layout";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unsealData } from "iron-session";
import {
  getAccountProfile,
  getDoctorProfile,
  getUserProfile,
} from "@/services/profile";
import { SessionData, defaultSession } from "@/utils/session";
import { useAppDispatch } from "@/redux/reduxHook";
import { updateProfile } from "@/redux/slice/profileSlice";
import {
  AccountProfile,
  GetDoctorProfile,
  GetUserProfile,
  defaultGetDoctorProfile,
  defaultGetUserProfile,
} from "@/types/responses/profile";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import ChatBox from "@/components/Chats/ChatBox";
import { Room } from "@/types/room";
import {
  Avatar,
  Box,
  Card,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  onSnapshot,
  query,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import dayjs from "dayjs";
import { colors } from "@/constants/colors";
import SetOnlineStatusForm from "@/components/form/SetOnlineStatusForm";
import { role } from "@/constants/role";
import { APIResponse } from "@/types/responses";
import prepareServerSide from "@/utils/prepareServerSide";

export default function Page({
  session,
  userProfile,
  doctorProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useAppDispatch();
  var accountProfile: AccountProfile;

  React.useLayoutEffect(() => {
    if (session.role === role.USER) {
      dispatch(
        updateProfile({
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          email_verified: userProfile.email_verified,
          photo_url: userProfile.photo_url,
          role: userProfile.role,
          account_type: userProfile.account_type,
          profile_set: userProfile.profile_set,
          date_of_birth: "",
        })
      );
    }

    if (session.role === role.DOCTOR) {
      dispatch(
        updateProfile({
          id: doctorProfile.id,
          name: doctorProfile.name,
          email: doctorProfile.email,
          email_verified: doctorProfile.email_verified,
          photo_url: doctorProfile.photo_url,
          role: doctorProfile.role,
          account_type: doctorProfile.account_type,
          profile_set: doctorProfile.profile_set,
          date_of_birth: "",
        })
      );
    }
  }, [userProfile, doctorProfile, dispatch, session.role]);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roomId, setRoomId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let roleQuery = "userId";
    let idQuery =
      session.role === role.USER
        ? userProfile.user.id
        : doctorProfile.doctor.id;

    if (session.role == role.DOCTOR) {
      roleQuery = "doctorId";
    }

    const unsubscribe = onSnapshot(
      query(collection(db, "rooms"), where(roleQuery, "==", idQuery)),
      (querySnapshot) => {
        let fetchedRooms: Room[] = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            fetchedRooms.push({
              id: doc.id,
              doctorId: doc.data().doctorId,
              doctorName: doc.data().doctorName,
              userId: doc.data().userId,
              userName: doc.data().userName,
              start: doc.data().start ?? Timestamp.now(),
              isTyping: doc.data().isTyping,
              end: doc.data().end ?? Timestamp.now(),
            });
          });
          fetchedRooms.sort((a, b) => +b.start - +a.start);
          setRooms(fetchedRooms);
          setFilteredRooms(fetchedRooms);
        }
        if (roomId === "" && !querySnapshot.empty) {
          setRoomId(fetchedRooms[0].id);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [doctorProfile.doctor.id, roomId, session.role, userProfile.user.id]);

  useEffect(() => {
    if (session.role === role.USER) {
      const newRoom = rooms.filter((doctor) =>
        doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(newRoom);
    }

    if (session.role === role.DOCTOR) {
      const newRoom = rooms.filter((user) =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(newRoom);
    }

    if (searchQuery === "") {
      setFilteredRooms(rooms);
    }
  }, [rooms, searchQuery, session.role]);

  return (
    <Layout>
      <div className="flex-row flex ">
        <div className="w-[35%] my-8 ml-8 max-h-[90vh]">
          <div className="flex-row flex gap-4 mb-8 mx-4">
            <Avatar
              src={
                session.role === role.USER
                  ? userProfile.photo_url
                  : doctorProfile.photo_url
              }
            />
            <div className="flex-col">
              <p className="font-extrabold">
                {session.role === role.USER
                  ? userProfile.name
                  : doctorProfile.name}
              </p>
              <p>
                {session.role === role.USER
                  ? userProfile.email
                  : doctorProfile.email}
              </p>
            </div>
          </div>
          {session.role === role.DOCTOR && (
            <div className="flex flex-col mb-4 mx-4 gap-3">
              <div className="flex-row flex gap-4 align-middle">
                <SetOnlineStatusForm
                  access_token={session?.access_token ?? ""}
                />
              </div>
              <Text color={colors.secondaryText} fontSize={"12px"}>
                Turn on your online status to receive patient chats
              </Text>
            </div>
          )}
          <div className="w-full">
            <Card className="p-4 overflow-hidden overflow-y-auto">
              <div className="flex flex-col ">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSearch(searchQuery);
                  }}
                >
                  <InputGroup>
                    <Input
                      type="text"
                      outline={"none"}
                      border={"none"}
                      backgroundColor={"#f3f3f3"}
                      placeholder="Search..."
                      onChange={(event) => {
                        setSearchQuery(event.currentTarget.value);
                      }}
                      _placeholder={{ opacity: 1, color: "#9b9b9b" }}
                    ></Input>
                    <InputRightElement>
                      <IconButton
                        type="submit"
                        aria-label="send"
                        variant="ghost"
                        colorScheme="blue"
                        fontSize={18}
                        icon={
                          <i className="fa-solid fa-magnifying-glass text-[#9b9b9b]" />
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                </form>
                <Box className="h-[56vh]">
                  {filteredRooms.length < 1 && (
                    <Flex className="mt-4">
                      <Text>No Chat Room</Text>
                    </Flex>
                  )}
                  {filteredRooms.map((room) => {
                    return (
                      <div
                        key={room.id}
                        onClick={() => {
                          setRoomId(room.id);
                        }}
                        style={{
                          verticalAlign: "middle",
                          alignItems: "center",
                        }}
                        className={`border-4 ${
                          roomId === room.id
                            ? "border-blue-500 "
                            : "  border-white"
                        } cursor-pointer text-[12px] my-4 p-4 rounded-md gap-2 align-middle flex flex-row`}
                      >
                        <Avatar size="md" />
                        <div className="flex-1">
                          <p className="font-extrabold text-base">
                            {session.role === role.DOCTOR
                              ? room.userName
                              : room.doctorName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold">
                            {dayjs(room.start.toDate()).format(
                              "DD MMM YYYY, HH:mm"
                            )}
                          </p>
                          <div
                            className={`p-1 w-fit ml-auto rounded-md text-right text-xl ${
                              room.end.toDate().getTime() < Date.now()
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {room.end.toDate().getTime() < Date.now() ? (
                              <i className="fa-solid fa-circle-check" />
                            ) : (
                              <i className="fa-solid fa-circle-play" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Box>
              </div>
            </Card>
          </div>
        </div>
        <ChatBox roomId={roomId} roleUser={session.role} />;
      </div>
    </Layout>
  );
}

type ServerSideProps = {
  session: SessionData;
  userProfile: GetUserProfile;
  doctorProfile: GetDoctorProfile;
};

export const getServerSideProps = prepareServerSide((async (context) => {
  try {
    const cookie = context.req.headers.cookie;

    const cSession = cookie
      ?.split("; ")
      .find((s) => s.startsWith(`${process.env.COOKIE_NAME}=`))
      ?.split("=")[1];

    if (!cSession) {
      throw new CookieNotFound();
    }

    const sessionData = await unsealData<SessionData>(cSession!!, {
      password: process.env.SESSION_SECRET as string,
    });

    let userProfileRes: APIResponse<GetUserProfile> | undefined;
    if (sessionData.role === role.USER) {
      userProfileRes = await getUserProfile(sessionData.access_token);
    }

    let doctorProfileRes: APIResponse<GetDoctorProfile> | undefined;
    if (sessionData.role === role.DOCTOR) {
      doctorProfileRes = await getDoctorProfile(sessionData.access_token);
    }

    return {
      props: {
        session: sessionData,
        userProfile: userProfileRes?.data ?? defaultGetUserProfile,
        doctorProfile: doctorProfileRes?.data ?? defaultGetDoctorProfile,
      },
    };
  } catch (e) {
    throw e;
  }
}) satisfies GetServerSideProps<ServerSideProps>);
