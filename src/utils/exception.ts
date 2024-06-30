import { HttpStatus } from "@/constants/api";
import { BadRequest } from "@/exceptions/badRequest";
import { InternalServerError } from "@/exceptions/internalServerError";
import { NotFound } from "@/exceptions/notFound";
import { ResponseError } from "@/exceptions/responseError";
import { Unauthorized } from "@/exceptions/unauthorized";
import { GetServerSideProps, GetServerSidePropsResult } from "next";

export const wrapError = async (e: unknown): Promise<Error> => {
	if (e instanceof ResponseError) {
		const res = await e.response.json();
		switch (e.response.status) {
			case HttpStatus.BadRequest:
				return new BadRequest(res.message);
			case HttpStatus.NotFound:
				return new NotFound(res.message);
			case HttpStatus.Unauthorized:
				return new Unauthorized(res.message);
			case HttpStatus.Forbidden:
				return new NotFound(res.message);
			default:
				return new InternalServerError(res.message);
		}
	}
	console.log(e);
	return new InternalServerError(`something went wrong`);
};

export const handleServerSideError = (<P>(e: any): GetServerSidePropsResult<P> => {
	if (e instanceof NotFound) {
		return {
			notFound: true,
		};
	}

	throw e;
});