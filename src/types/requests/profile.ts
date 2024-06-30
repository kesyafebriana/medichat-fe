export interface CreateUserProfileRequest {
	account_id: number;
	name: string;
	date_of_birth: string;
	alias: string;
	address: string;
	lat: number;
	lng: number;
	image: any;
}

interface LocationRequest {
	alias: string;
	address: string;
	coordinate: {
		lat: number;
		lon: number;
	};
	is_active: boolean;
}

export interface CreateUserLocationRequest extends LocationRequest {}

export interface UpdateUserLocationRequest extends LocationRequest {
	id: number;
}

export interface UpdateUserProfileRequest {
	name: string;
	date_of_birth: string;
	photo: any;
}

export interface CreateDoctorProfileRequest {
	name: string;
	str: string;
	specialization_id: number;
	work_location: string;
	gender: string;
	phone_number: string;
	is_active: boolean;
	start_work_date: string;
	year_experience: number;
	price: number;
	certificate: any;
	photo: any;
}

export interface UpdateDoctorProfileRequest
	extends Pick<
		CreateDoctorProfileRequest,
		"name" | "work_location" | "gender" | "photo" | "phone_number" | "price"
	> {}

export const toDoctorProfileFormData = (
	req: CreateDoctorProfileRequest
): string => {
	return JSON.stringify({
		name: req.name,
		str: req.str,
		specialization_id: req.specialization_id,
		work_location: req.work_location,
		gender: req.gender,
		phone_number: req.phone_number,
		is_active: req.is_active,
		start_work_date: req.start_work_date,
		year_experience: req.year_experience,
		price: req.price,
	});
};

export const toUserFormData = (req: CreateUserProfileRequest): string => {
	return JSON.stringify({
		account_id: req.account_id,
		name: req.name,
		date_of_birth: req.date_of_birth,
		locations: [
			{
				alias: req.alias,
				address: req.address,
				is_active: true,
				coordinate: {
					lat: req.lat,
					lon: req.lng,
				},
			},
		],
	});
};

export interface Specialization {
	id: number;
	name: string;
}

export interface UpdateDoctorActiveStatus {
	is_active: boolean;
}

export const toDoctorActiveStatusFormData = (req: UpdateDoctorActiveStatus): string => {
	return JSON.stringify({
		is_active: req.is_active,
	})
}
