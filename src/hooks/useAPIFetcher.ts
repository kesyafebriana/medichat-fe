import { ResponseError } from "@/exceptions/responseError";
import { APIResponse } from "@/types/responses";
import path from "path";
import { useEffect } from "react";
import useSWR, { SWRResponse } from "swr";

export async function fetchJson<JSON = unknown>(
	input: RequestInfo,
	init?: RequestInit
): Promise<JSON> {
    const { headers, ..._init } = init ?? {};
    const res = await fetch(input, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            ...headers,
        },
        ..._init,
    })
    if (res.status >= 400) {
        throw new ResponseError("something went wrong", res);
    }
    return await res.json()
}

export interface APIFetcherOptions<Response> {
    accessToken?: string,
    fallbackData?: Response,
    method?: string,
    body?: any,
    requireToken?: boolean,
}

export default function useAPIFetcher<Response = unknown>(
    apiPath: string,
    options?: APIFetcherOptions<Response>,
): SWRResponse<APIResponse<Response>> {
    const ret = useSWR(
        () => {
            if (options?.requireToken && !options.accessToken) return null;
            return `${process.env.NEXT_PUBLIC_API_URL ?? ""}${path.join('/', apiPath)}`
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
            fallbackData: {
                message: "fetching",
                data: options?.fallbackData,
            },
        }
    );

    const mutate = ret.mutate;

    useEffect(
        () => {
            mutate()
        },
        [mutate, options?.accessToken],
    );

    return ret;
}