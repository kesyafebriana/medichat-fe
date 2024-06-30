import {
	CreatePharmacyRequest,
	PharmacyListQuery,
	UpdatePharmacyRequest,
	UpdateShipmentMethodRequest,
	toPharmacyListQueryString,
} from "@/types/requests/pharmacies";
import { APIResponse } from "@/types/responses";
import {
	Pharmacies,
	PharmaciesPaginatedResponse,
	PharmacyOperation,
	PharmacyShipmentMethod,
} from "@/types/responses/pharmacies";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const createPharmacy = async (
	payload: CreatePharmacyRequest,
	token: string
): Promise<APIResponse<Pharmacies> | undefined> => {
	try {
		return await apiService.post<APIResponse<Pharmacies>>("pharmacies", {
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

export const getPharmacies = async (
	query: PharmacyListQuery
): Promise<APIResponse<Pharmacies> | undefined> => {
	try {
		const queryString = toPharmacyListQueryString(query);
		return await apiService.get<APIResponse<Pharmacies>>(
			`pharmacies?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getOwnPharmacies = async (
	query: PharmacyListQuery,
	token: string
): Promise<APIResponse<PharmaciesPaginatedResponse> | undefined> => {
	try {
		const queryString = toPharmacyListQueryString(query);
		return await apiService.get<APIResponse<PharmaciesPaginatedResponse>>(
			`pharmacies/own?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getPharmaciesByProductSlug = async (
	slug: string,
	query: PharmacyListQuery
): Promise<APIResponse<Pharmacies> | undefined> => {
	try {
		const queryString = toPharmacyListQueryString({
			...query,
			product_slug: slug,
		});
		return await apiService.get<APIResponse<Pharmacies>>(
			`pharmacies/product?${queryString}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getPharmacyBySlug = async (
	slug: string
): Promise<APIResponse<Pharmacies> | undefined> => {
	try {
		return await apiService.get<APIResponse<Pharmacies>>(`pharmacies/${slug}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getPharmacyOperation = async (
	slug: string
): Promise<APIResponse<PharmacyOperation[]> | undefined> => {
	try {
		return await apiService.get<APIResponse<PharmacyOperation[]>>(
			`pharmacies/${slug}/operations`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const getShipmentMethodBySlug = async (
	slug: string
): Promise<APIResponse<PharmacyShipmentMethod> | undefined> => {
	try {
		return await apiService.get<APIResponse<PharmacyShipmentMethod>>(
			`pharmacies/${slug}/shipments`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const deletePharmacy = async (
	slug: string,
	token: string
): Promise<null | undefined> => {
	try {
		return await apiService.delete<null | undefined>(`pharmacies/${slug}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updatePharmacy = async (
	slug: string,
	token: string,
	payload: UpdatePharmacyRequest
): Promise<APIResponse<Pharmacies> | undefined> => {
	try {
		return await apiService.put<APIResponse<Pharmacies>>(`pharmacies/${slug}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updatePharmacyOperation = async (
	slug: string,
	token: string,
	payload: PharmacyOperation[]
): Promise<APIResponse<PharmacyOperation[]> | undefined> => {
	try {
		return await apiService.put<APIResponse<PharmacyOperation[]>>(
			`pharmacies/${slug}/operations`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};

export const updateShipmentMethod = async (
	payload: UpdateShipmentMethodRequest,
	slug: string,
	token: string
): Promise<APIResponse<PharmacyShipmentMethod> | undefined> => {
	try {
		return await apiService.put<APIResponse<PharmacyShipmentMethod>>(
			`pharmacies/${slug}/shipments`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);
	} catch (e) {
		throw await wrapError(e);
	}
};
