import { HttpStatus } from "@/constants/api";
import { serverEncounterError } from "@/constants/error";
import { ResponseError } from "@/exceptions/responseError";
import { updateDoctorProfile } from "@/services/profile";
import { UpdateDoctorProfileRequest } from "@/types/requests/profile";
import {
	DoctorProfile,
	GetDoctorProfile,
	defaultDoctorProfile,
} from "@/types/responses/profile";
import { wrapError } from "@/utils/exception";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UpdateDoctorProfileData {
	token: string;
	payload: UpdateDoctorProfileRequest;
}

export const updateDoctorProfileAction = createAsyncThunk(
	"doctorProfile/update",
	async (req: UpdateDoctorProfileData, { rejectWithValue }) => {
		try {
			await updateDoctorProfile(req.payload, req.token);
			return {
				...req.payload,
				photo:
					req.payload.photo !== undefined
						? URL.createObjectURL(req.payload.photo)
						: undefined,
			};
		} catch (e) {
			if (e instanceof ResponseError) {
				const err = await wrapError(e);
				return rejectWithValue({
					meta: {
						statusCode: e.response.status,
						message:
							e.response.status === HttpStatus.InternalServerError
								? serverEncounterError
								: err.message,
					},
				});
			}
		}
	}
);

export const doctorProfileSlice = createSlice({
	name: "doctorProfile",
	initialState: defaultDoctorProfile,
	reducers: {
		setDoctorProfile: (state, action: PayloadAction<DoctorProfile>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.photo_url = action.payload.photo_url;
			state.str = action.payload.str;
			state.specialization = action.payload.specialization;
			state.work_location = action.payload.work_location;
			state.gender = action.payload.gender;
			state.phone_number = action.payload.phone_number;
			state.is_active = action.payload.is_active;
			state.start_work_date = action.payload.start_work_date;
			state.year_experience = action.payload.year_experience;
			state.price = action.payload.price;
			state.certification_url = action.payload.certification_url;
		},
		updateDoctorProfileRdx: (
			state,
			action: PayloadAction<GetDoctorProfile>
		) => {
			if (action.payload) {
				state.email = action.payload.email;
				state.str = action.payload.doctor.str;
				state.id = action.payload.doctor.id;
				state.name = action.payload.name;
				state.photo_url = action.payload.photo_url;
				state.specialization = {
					id: action.payload.doctor.specialization.id,
					name: action.payload.doctor.specialization.name,
				};
				state.work_location = action.payload.doctor.work_location;
				state.gender = action.payload.doctor.gender;
				state.phone_number = action.payload.doctor.phone_number;
				state.is_active = action.payload.doctor.is_active;
				state.start_work_date = action.payload.doctor.start_working_date;
				state.year_experience = action.payload.doctor.year_experience;
				state.price = action.payload.doctor.price;
				state.certification_url = action.payload.doctor.certificate_url;
			}
		},
		clearDoctorProfile: (state) => {
			state.id = 0;
			state.name = "";
			state.photo_url = "";
			state.str = "";
			state.specialization = {
				id: 0,
				name: "",
			};
			state.work_location = "";
			state.gender = "";
			state.phone_number = "";
			state.is_active = false;
			state.start_work_date = "";
			state.year_experience = 0;
			state.price = 0;
			state.certification_url = "";
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			updateDoctorProfileAction.fulfilled,
			(
				state,
				action: PayloadAction<UpdateDoctorProfileRequest | undefined>
			) => {
				if (action.payload) {
					state.name = action.payload.name;
					state.work_location = action.payload.work_location;
					state.gender = action.payload.gender;
					state.phone_number = action.payload.phone_number;
					state.photo_url =
						action.payload.photo === undefined
							? state.photo_url
							: action.payload.photo;
					state.price = action.payload.price;
				}
			}
		);
	},
});

export const { setDoctorProfile, clearDoctorProfile, updateDoctorProfileRdx } =
	doctorProfileSlice.actions;
export default doctorProfileSlice.reducer;
