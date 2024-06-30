import { colors } from "@/constants/colors";
import { serverEncounterError } from "@/constants/error";
import { pages } from "@/constants/pages";
import { InternalServerError } from "@/exceptions/internalServerError";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useSession from "@/hooks/useSession";
import Layout from "@/layouts/layout";
import { startChat } from "@/services/chats";
import { FormState, defaultFormState } from "@/types/form";
import { Chat } from "@/types/requests/chats";
import { GetDoctorProfile, defaultGetDoctorProfile } from "@/types/responses/profile";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { NextPageContext } from "next/types";
import React from "react";

const Page = ({ slug }: PageParams) => {
  const [formState, setFormState] = React.useState<FormState>(defaultFormState);
  const session = useSession();
  const router = useRouter();
  const toast = useToast();
  const { data: doctorData, isLoading } = useAPIFetcher<GetDoctorProfile>(
    `/doctors/${slug}`, 
    {
      fallbackData: defaultGetDoctorProfile,
    }
  )
  const doctor = doctorData?.data

  const onCreateChat = async () => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      await startChat(
        {
          doctor_id: doctor?.doctor.id ?? 0,
        },
        session.session?.access_token ?? '0'
      )
    } catch (e: any) {
      if (e instanceof InternalServerError) {
        setFormState((prev) => ({
          ...prev,
          errorMessage: serverEncounterError,
        }));
      }
      setFormState((prev) => ({ ...prev, errorMessage: e.message }));
      toast({
				title: "Error Create Room",
        isClosable: true,
        description: "Please try again in a few moments.",
				duration: 3000,
				position: "top-right",
			});
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
      toast({
				title: "Chat Room Created",
				description: "successfully create chat room with doctor.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
      router.push('/chats')
    }
  }

  return (
    <Layout>
      <HStack>
        <HStack
          width={"full"}
          height={"200px"}
          bg={colors.primary}
          className="py-12 lg:py-16 relative"
        >
          <Flex
            className="absolute lg:top-1/3 pt-20 lg:pt-0 px-8 lg:px-16"
            gap={"30px"}
            w={"full"}
            h={"300px"}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <Box
              bg={colors.white}
              width={{ base: "full", lg: "225px" }}
              height={{ base: "full", lg: "300px" }}
              objectFit={"contain"}
              className="shadow-lg"
              borderRadius={"8px"}
              maxW={{ lg: "20%" }}
            >
              <Image
                src={doctor?.photo_url}
                alt={doctor?.name}
                width={{ base: "full", lg: "225px" }}
                height={{ base: "full", lg: "300px" }}
                objectFit={"contain"}
              />
            </Box>
            <Flex
              flexDirection={"column"}
              justifyContent={"space-between"}
              w={"80%"}
              h={"300px"}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"space-around"}
                h={"250px"}
              >
                <Badge
                  color={
                    doctor?.doctor.is_active
                      ? colors.success
                      : colors.secondaryText
                  }
                  bg={doctor?.doctor.is_active ? `#E3F0E3` : `#EEEEEE`}
                  w={"fit-content"}
                >
                  <i className="fa-solid fa-circle"></i>{" "}
                  {doctor?.doctor.is_active ? "Online" : "Offline"}
                </Badge>
                <Text
                  color={{ base: colors.primaryText, lg: colors.white }}
                  fontSize={{ base: "24px", lg: "32px" }}
                  fontWeight={600}
                >
                  {doctor?.name}
                </Text>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                w={{ lg: "full" }}
                h={"full"}
                alignItems={"center"}
                flexDirection={{ base: "column", lg: "row" }}
                gap={{ base: "20px", lg: "0px" }}
              >
                <Flex
                  flexDirection={"column"}
                  w={{ lg: "400px" }}
                  h={"full"}
                  justifyContent={"space-around"}
                >
                  <Box>
                    <Text
                      color={colors.secondaryText}
                      fontWeight={500}
                      fontSize={"24px"}
                    >
                      {doctor?.doctor.specialization.name}
                    </Text>
                  </Box>
                  <Box>
                    <HStack>
                      <Badge
                        fontSize={"14px"}
                        color={colors.primary}
                        bg={`${colors.primary}20`}
                      >
                        <i className="fa-solid fa-briefcase"></i>{" "}
                        {doctor?.doctor.year_experience}{" "}
                        {(doctor?.doctor.year_experience ?? 0) > 1 ? "years" : "year"}
                      </Badge>
                      <Badge
                        fontSize={"14px"}
                        color={colors.primary}
                        bg={`${colors.primary}20`}
                      >
                        <i className="fa-solid fa-thumbs-up"></i>{" "}
                        {95}%
                      </Badge>
                    </HStack>
                  </Box>
                </Flex>
                {doctor?.doctor.is_active && (
                  <form onSubmit={(ev) => {
                    ev.preventDefault();
                    onCreateChat();
                  }}>
                    <Button
                    variant={"brandPrimary"}
                    bg={colors.primary}
                    color={colors.white}
                    w={"250px"}
                    type="submit"
                  >
                    Chat
                  </Button>
                  </form>
                )}
              </Flex>
            </Flex>
          </Flex>
        </HStack>
      </HStack>
      <Flex
        justifyContent={"space-between"}
        mt={{ base: "430px", lg: "200px" }}
        mb={{ lg: "50px" }}
        className="px-8 lg:px-16"
      >
        <Card
          className="flex flex-col justify-between"
          padding={"30px"}
          width={"400px"}
          height={"150px"}
        >
          <Text fontSize={"32px"} fontWeight={600} color={colors.primary}>
            Start Working
          </Text>
          <Text color={colors.secondaryText}>
            {doctor?.doctor.start_working_date}
          </Text>
        </Card>
        <Card
          className="flex flex-col justify-between"
          padding={"30px"}
          width={"400px"}
          height={"150px"}
        >
          <Text fontSize={"32px"} fontWeight={600} color={colors.primary}>
            Working At
          </Text>
          <Text color={colors.secondaryText}>{doctor?.doctor.work_location}</Text>
        </Card>
        <Card
          className="flex flex-col justify-between"
          padding={"30px"}
          width={"400px"}
          height={"150px"}
        >
          <Text fontSize={"32px"} fontWeight={600} color={colors.primary}>
            STR Number
          </Text>
          <Text color={colors.secondaryText}>{doctor?.doctor.str}</Text>
        </Card>
      </Flex>
    </Layout>
  );
}

interface PageParams {
  slug: string;
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  return { slug: ctx.query.slug };
};

export default Page;