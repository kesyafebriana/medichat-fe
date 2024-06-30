import { APIResponse } from "@/types/responses";
import path from "path";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { APIFetcherOptions, fetchJson } from "./useAPIFetcher";
import { useEffect } from "react";

export default function useAPIInfinite<Response = unknown>(
    getKey: (index: number, lastPage?: Response) => string | null,
    options?: APIFetcherOptions<Response>,
): SWRInfiniteResponse<APIResponse<Response>> {
    const ret = useSWRInfinite<APIResponse<Response>>(
        (index: number, lastPage?: APIResponse<Response>): string | null => {
            const lastPageData = lastPage?.data
            const apiPath = getKey(index, lastPageData);
            if (apiPath == null) {
                return null
            }
            return `${process.env.NEXT_PUBLIC_API_URL ?? ""}${path.join('/', apiPath)}`;
        },
        (input) => fetchJson<APIResponse<Response>>(
            input,
            {
                method: options?.method,
                headers: {
                    Authorization: options?.accessToken ? `Bearer ${options.accessToken}` : ""
                },
                body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
            }
        ),
        {
            initialSize: 1,
            fallbackData: [],
        }
    );

    useEffect(
        () => {
            ret.mutate()
        },
        [ret, options?.accessToken],
    );

    return ret;
}