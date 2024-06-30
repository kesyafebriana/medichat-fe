import { CreatePharmacyManagerRequest, DeletePharmacyManagerRequest } from "@/types/requests/partner";
import { APIResponse } from "@/types/responses";
import { PharmacyManager, PharmacyManagerPaginatedResponse } from "@/types/responses/partner";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const createPharmacyManager = async (
    payload: CreatePharmacyManagerRequest,
    token: string
): Promise<APIResponse<null> | undefined> => {
    try {
        return await apiService.post<APIResponse<null>>("admin/pharmacy-managers", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        throw await wrapError(e);
    }
};

export const deletePharmacyManager = async (
    payload: DeletePharmacyManagerRequest,
    token: string
): Promise<APIResponse<null> | undefined> => {
    try {
        return await apiService.delete<APIResponse<null>>(`admin/pharmacy-managers/${payload.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (e) {
        throw await wrapError(e);
    }
};

export const getPharmacyManager = async (
    token: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortType?: "ASC" | "DESC",
    term?: string,
    profileSet?: string,
): Promise<APIResponse<PharmacyManagerPaginatedResponse> | undefined> => {
    try {
        const params: { [key: string]: any } = {};

        if (page !== undefined) params.page = page;
        if (limit !== undefined) params.limit = limit;
        if (sortBy !== undefined) params.sort_by = sortBy;
        if (sortType !== undefined) params.sort_type = sortType;
        if (term !== undefined) params.term = term;
        if (profileSet !== undefined) params.profile_set = profileSet;

        const queryingString = new URLSearchParams(params).toString()

        return await apiService.get<APIResponse<PharmacyManagerPaginatedResponse>>(`admin/pharmacy-managers?${queryingString}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (e) {
        throw await wrapError(e);
    }
};