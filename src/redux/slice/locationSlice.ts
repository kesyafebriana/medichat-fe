import { HttpStatus } from "@/constants/api";
import { serverEncounterError } from "@/constants/error";
import { ResponseError } from "@/exceptions/responseError";
import {
	createUserLocation,
	deleteUserLocation,
	updateMainLocation,
	updateUserLocation,
} from "@/services/profile";
import {
	CreateUserLocationRequest,
	UpdateUserLocationRequest,
} from "@/types/requests/profile";
import { UserLocation } from "@/types/responses/profile";
import { wrapError } from "@/utils/exception";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationSliceInitialState {
	main_location_id: number;
	locations: UserLocation[];
}

const initialState: LocationSliceInitialState = {
	main_location_id: 0,
	locations: [],
};

interface ActionData {
	token: string;
}

interface AddAdressData extends ActionData {
	payload: CreateUserLocationRequest;
}

interface ActionDataWithId extends ActionData {
	id: number;
}

interface UpdateAddressData extends ActionData {
	payload: UpdateUserLocationRequest;
}

export const addAddressAction = createAsyncThunk(
	"locations/add",
	async (req: AddAdressData, { rejectWithValue }) => {
		try {
			const res = await createUserLocation(req.payload, req.token);
			return res?.data;
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

export const deleteAddressAction = createAsyncThunk(
	"locations/delete",
	async (req: ActionDataWithId, { rejectWithValue }) => {
		try {
			await deleteUserLocation(req.id, req.token);
			return {
				id: req.id,
			};
		} catch (e) {
			if (e instanceof ResponseError) {
				const err = await wrapError(e);
				return rejectWithValue({
					payload: {
						id: req.id,
					},
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

export const updateMainLocationAction = createAsyncThunk(
	"locations/setMainLocation",
	async (req: ActionDataWithId, { rejectWithValue }) => {
		try {
			await updateMainLocation(req.id, req.token);
			return {
				id: req.id,
			};
		} catch (e) {
			if (e instanceof ResponseError) {
				const err = await wrapError(e);
				return rejectWithValue({
					payload: {
						id: req.id,
					},
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

export const updateAddressAction = createAsyncThunk(
	"locations/update",
	async (req: UpdateAddressData, { rejectWithValue }) => {
		try {
			const res = await updateUserLocation(req.payload, req.token);
			return res?.data;
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

export const locationSlice = createSlice({
	name: "locations",
	initialState,
	reducers: {
		setLocations: (state, action: PayloadAction<LocationSliceInitialState>) => {
			state.locations = action.payload.locations;
			state.main_location_id = action.payload.main_location_id;
		},
		addLocation: (state, action: PayloadAction<UserLocation | undefined>) => {
			if (action.payload) {
				const updatedLocations = state.locations.map((l) => ({
					...l,
					is_active: false,
				}));
				updatedLocations.push(action.payload);
				state.locations = updatedLocations;
			}
		},
		clearLocation: (state) => {
			state.main_location_id = 0;
			state.locations = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			addAddressAction.fulfilled,
			(state, action: PayloadAction<UserLocation | undefined>) => {
				action.payload && state.locations.push(action.payload);
			}
		);
		builder.addCase(
			deleteAddressAction.fulfilled,
			(state, action: PayloadAction<{ id: number } | undefined>) => {
				state.locations = state.locations.filter(
					(l) => l.id !== action.payload?.id
				);
			}
		);
		builder.addCase(
			updateAddressAction.fulfilled,
			(state, action: PayloadAction<UserLocation | undefined>) => {
				const idx = state.locations.findIndex(
					(l) => l.id === action.payload?.id
				);
				if (idx >= 0 && action.payload) {
					state.locations[0] = action.payload;
				}
			}
		);
		builder.addCase(
			updateMainLocationAction.fulfilled,
			(state, action: PayloadAction<{ id: number } | undefined>) => {
				if (action.payload) {
					state.main_location_id = action.payload.id;
				}
			}
		);
	},
});

export const { setLocations, clearLocation, addLocation } =
	locationSlice.actions;
export default locationSlice.reducer;
