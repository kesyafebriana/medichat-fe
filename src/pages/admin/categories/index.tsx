import React from "react";
import {
  Container,
  Flex,
} from "@chakra-ui/react";
import Header from "@/components/ui/Header";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { SessionData, defaultSession } from "@/utils/session";
import { unsealData } from "iron-session";
import { role } from "@/constants/role";
import CategoryTable from "@/components/table/CategoryTable";

const Page = (
  { session }: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  return (
    <main>
      <Header role={role.ADMIN} />
      <Flex
        maxW="100vw"
        flexDirection="row"
        marginTop="25px"
        justifyContent="center"
      >
        <Container
          maxW="100vw"
          paddingLeft="0"
          marginRight="20px"
          className="flex flex-col "
        >
          <CategoryTable access_token={session.access_token} />
        </Container>
      </Flex>
    </main>
  );
};

export default Page;

type ServerSideProps = {
  session: SessionData;
};

export const getServerSideProps = (async (context) => {
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

    return {
      props: {
        session: sessionData,
      },
    };
  } catch (e) {
    return {
      props: {
        session: defaultSession,
      },
    };
  }
}) satisfies GetServerSideProps<ServerSideProps>;