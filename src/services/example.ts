import { HttpStatus } from "@/constants/api";
import { InternalServerError } from "@/exceptions/internalServerError";
import { NotFound } from "@/exceptions/notFound";
import { ResponseError } from "@/exceptions/responseError";
import { Post } from "@/types/response";
import { jsonPlaceholderService } from "@/utils/apiService";

export const getPosts = async (): Promise<Post[] | undefined> => {
	try {
		const res = await jsonPlaceholderService.get<Post[]>("/posts");
		return res;
	} catch (e) {
		if (e instanceof ResponseError) {
			switch (e.response.status) {
				case HttpStatus.NotFound:
					throw new NotFound(e.message);
				default:
					throw new InternalServerError(e.message);
			}
		}
		throw e;
	}
};
