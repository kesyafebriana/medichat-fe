import { CookieNotFound } from "@/exceptions/cookieNotFound";
import { NotFound } from "@/exceptions/notFound";
import { Unauthorized } from "@/exceptions/unauthorized";
import { refreshSession } from "@/services/sessions";
import { GetServerSideProps } from "next";

const prepareServerSide = <P extends { [key: string]: any }>(
  get: GetServerSideProps<P>
): GetServerSideProps<P> => {
  return async (context) => {
    try {
      return await get(context);
    } catch (e) {
      if (e instanceof NotFound) {
        return {
          notFound: true,
        }
      }

      if (e instanceof CookieNotFound) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          }
        }
      }

      if (e instanceof Unauthorized) {
        return {
          redirect: {
            destination: `/refresh?redirect=${context.resolvedUrl}`,
            permanent: false,
          }
        }
      }

      throw e;
    }
  };
};

export default prepareServerSide;
