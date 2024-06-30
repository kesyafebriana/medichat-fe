import { Entries } from "@/types";
import { UserProfile } from "@/types/responses/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserProfile = {
	id: 0,
	email: "",
	date_of_birth: "",
	email_verified: false,
	name: "",
	photo_url: "",
	role: "",
	account_type: "",
	profile_set: false,
};

export const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		setProfile: (state, action: PayloadAction<UserProfile>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.email = action.payload.email;
			state.email_verified = action.payload.email_verified;
			state.photo_url = action.payload.photo_url;
			state.role = action.payload.role;
			state.account_type = action.payload.account_type;
			state.profile_set = action.payload.profile_set;
			state.date_of_birth = action.payload.date_of_birth;
		},
		updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
			for (const [key, value] of Object.entries(
				action.payload
			) as Entries<UserProfile>) {
				state[key] = value as never;
			}
		},
		resetProfile: (state) => {
			state.id = 0;
			state.name = "";
			state.email = "";
			state.email_verified = false;
			state.photo_url = "";
			state.role = "";
			state.account_type = "";
			state.profile_set = false;
			state.date_of_birth = "";
		},
	},
});

export const { setProfile, resetProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
