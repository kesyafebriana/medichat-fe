import {
	CreateDoctorProfileRequest,
	CreateUserLocationRequest,
	CreateUserProfileRequest,
	Specialization,
	UpdateDoctorProfileRequest,
	UpdateUserLocationRequest,
	UpdateUserProfileRequest,
	toDoctorProfileFormData,
	toUserFormData,
} from "@/types/requests/profile";
import { APIResponse } from "@/types/responses";
import {
	AccountProfile,
	GetDoctorProfile,
	GetUserProfile,
	UserLocation,
} from "@/types/responses/profile";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getAccountProfile = async (
	token: string
): Promise<APIResponse<AccountProfile> | undefined> => {
	try {
		const res = await apiService.get<APIResponse<AccountProfile>>(
			"auth/profile",
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

export const getUserProfile = async (
	token: string
): Promise<APIResponse<GetUserProfile> | undefined> => {
	try {
		const res = await apiService.get<APIResponse<GetUserProfile>>(
			"users/profile",
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

export const createUserProfile = async (
	payload: CreateUserProfileRequest,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		const formData = new FormData();
		formData.append("data", toUserFormData(payload));
		const res = await apiService.post<APIResponse<null>>("users/profile", {
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateUserProfile = async (
	payload: UpdateUserProfileRequest,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		const formData = new FormData();
		formData.append(
			"data",
			JSON.stringify({
				name: payload.name,
				date_of_birth: payload.date_of_birth,
			})
		);
		if (payload.photo != undefined) {
			formData.append("photo", payload.photo);
		}
		const res = await apiService.put<APIResponse<null>>("users/profile", {
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const createUserLocation = async (
	payload: CreateUserLocationRequest,
	token: string
): Promise<APIResponse<UserLocation> | undefined> => {
	try {
		const res = apiService.post<APIResponse<UserLocation>>(
			"users/profile/locations",
			{
				body: JSON.stringify(payload),
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

export const deleteUserLocation = async (
	id: number,
	token: string
): Promise<null | undefined> => {
	try {
		const res = apiService.delete<null>(`users/profile/locations/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateUserLocation = async (
	payload: UpdateUserLocationRequest,
	token: string
) => {
	try {
		const res = apiService.put<APIResponse<UserLocation>>(
			"users/profile/locations",
			{
				body: JSON.stringify(payload),
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

export const updateMainLocation = async (
	locationId: number,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		const formData = new FormData();
		formData.append(
			"data",
			JSON.stringify({
				main_location_id: locationId,
			})
		);
		const res = apiService.put<APIResponse<null>>("users/profile", {
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const createDoctorProfile = async (
	payload: CreateDoctorProfileRequest,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		const formData = new FormData();
		formData.append("certificate", payload.certificate);
		formData.append("data", toDoctorProfileFormData(payload));
		const res = await apiService.post<APIResponse<null>>("doctors/profile", {
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateDoctorProfile = async (
	payload: UpdateDoctorProfileRequest,
	token: string
): Promise<APIResponse<null> | undefined> => {
	try {
		const formData = new FormData();
		if (payload.photo != undefined) {
			formData.append("photo", payload.photo);
		}
		formData.append(
			"data",
			JSON.stringify({
				name: payload.name,
				work_location: payload.work_location,
				gender: payload.gender,
				phone_number: payload.phone_number,
				price: payload.price,
			})
		);
		const res = await apiService.put<APIResponse<null>>("doctors/profile", {
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getSpecializations = async (): Promise<
	APIResponse<Specialization[] | undefined> | undefined
> => {
	try {
		const res = await apiService.get<APIResponse<Specialization[] | undefined>>(
			"specializations",
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getDoctorProfile = async (
	token: string
): Promise<APIResponse<GetDoctorProfile> | undefined> => {
	try {
		const res = await apiService.get<APIResponse<GetDoctorProfile>>(
			"doctors/profile",
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (e) {
		throw await wrapError(e);
	}
};
