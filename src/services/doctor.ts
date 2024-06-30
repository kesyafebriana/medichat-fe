import { UpdateDoctorActiveStatus, toDoctorActiveStatusFormData } from "@/types/requests/profile";
import { APIResponse } from "@/types/responses";
import { GetDoctorProfile } from "@/types/responses/profile";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getDoctorProfile = async (
	token: string
): Promise<APIResponse<GetDoctorProfile> | undefined> => {
	try {
		const res = await apiService.get<APIResponse<GetDoctorProfile>>(
			"doctors/profile",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateActiveStatus = async (
    payload: UpdateDoctorActiveStatus,
    token: string
): Promise<APIResponse<null> | undefined> => {
    try {
        const res = await apiService.post<APIResponse<null>>("doctors/profile/active-status", {
			body: toDoctorActiveStatusFormData(payload),
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
        return res;
	} catch (e) {
		throw await wrapError(e);
	}
}