export interface UserLocation {
	id: number;
	alias: string;
	address: string;
	coordinate: {
		lat: number;
		lon: number;
	};
	is_active: boolean;
}

export const defaultUserLocation: UserLocation = {
	id: 0,
	alias: "",
	address: "",
	coordinate: {
		lat: 0,
		lon: 0,
	},
	is_active: false,
}

export interface AccountProfile {
	id: number;
	email: string;
	email_verified: boolean;
	name: string;
	photo_url: string;
	role: string;
	account_type: string;
	profile_set: boolean;
}

export const defaultAccountProfile = {
	id: 0,
	email: "",
	email_verified: false,
	name: "",
	photo_url: "",
	role: "",
	account_type: "",
	profile_set: false,
};

export interface UserProfile extends AccountProfile {
	date_of_birth: string;
}

export interface GetUserProfile extends AccountProfile {
	user: {
		id: number;
		date_of_birth: string;
		main_location_id: number;
		locations: UserLocation[];
	};
}

export const defaultGetUserProfile: GetUserProfile = {
	id: 0,
	email: "",
	email_verified: false,
	name: "",
	photo_url: "",
	role: "",
	account_type: "",
	profile_set: false,
	user: {
		id: 0,
		date_of_birth: "",
		main_location_id: 0,
		locations: [],
	},
};

export interface DoctorProfile {
	id: number;
	name: string;
	photo_url: string;
	str: string;
	specialization: {
		id: number;
		name: string;
	};
	work_location: string;
	gender: string;
	phone_number: string;
	is_active: boolean;
	start_work_date: string;
	year_experience: number;
	price: number;
	certification_url: string;
}

export interface GetDoctorProfile extends AccountProfile {
	doctor: {
		id: number;
		specialization: {
			id: number;
			name: string;
		};
		str: string;
		work_location: string;
		gender: string;
		phone_number: string;
		is_active: boolean;
		start_working_date: string;
		year_experience: number;
		price: number;
		certificate_url: string;
	};
}

export const defaultGetDoctorProfile: GetDoctorProfile = {
	id: 0,
	email: "",
	email_verified: false,
	name: "",
	photo_url: "",
	role: "",
	account_type: "",
	profile_set: false,
	doctor: {
		id: 0,
		specialization: {
			id: 0,
			name: "",
		},
		str: "",
		work_location: "",
		gender: "",
		phone_number: "",
		is_active: true,
		start_working_date: "",
		year_experience: 0,
		price: 0,
		certificate_url: "",
	},
};

export const defaultDoctorProfile: DoctorProfile & { email: string } = {
	id: 0,
	email: "",
	name: "",
	photo_url: "",
	str: "",
	specialization: {
		id: 0,
		name: "",
	},
	work_location: "",
	gender: "",
	phone_number: "",
	is_active: false,
	start_work_date: "",
	year_experience: 0,
	price: 0,
	certification_url: "",
};

export interface Specialization {
    id: number;
    name: string;
}

export interface DoctorData {
	id: number;
    specialication: Specialization;
    str: string;
    work_location: string;
    gender: string;
    phone_number: string;
    is_active: boolean;
    start_working_date: string;
    year_experience: number;
    price: number;
    certificate_url: string;
}
