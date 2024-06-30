import { APIResponse } from "@/types/responses";
import { PharmacyPaginatedResponse } from "@/types/responses/pharmacy";
import apiService from "@/utils/apiService";
import { wrapError } from "@/utils/exception";

export const getPharmaciesByProductSlug = async (
  slug: string,
  lon: number,
  lat: number
): Promise<APIResponse<PharmacyPaginatedResponse> | undefined> => {
  try {
    const res = await apiService.get<APIResponse<PharmacyPaginatedResponse>>(
      `pharmacies/product?sort_by=name&sort=asc&page=1&limit=10&product_slug=${slug}&long=${lon}&lat=${lat}`
    );
    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};

export const getPharmaciesByProductSlugClosest = async (
  slug: string,
  lon: number,
  lat: number
): Promise<APIResponse<PharmacyPaginatedResponse> | undefined> => {
  try {
    const res = await apiService.get<APIResponse<PharmacyPaginatedResponse>>(
      `pharmacies/product?sort_by=distance&sort=asc&page=1&limit=1&product_slug=${slug}&long=${lon}&lat=${lat}`
    );

    return res;
  } catch (e) {
    throw await wrapError(e);
  }
};
