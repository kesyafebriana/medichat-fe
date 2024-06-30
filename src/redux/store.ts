import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { createWrapper } from "next-redux-wrapper";
import { persistStore, PersistState } from "redux-persist";
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import profileReducer from "./slice/profileSlice";
import locationReducer, {
	LocationSliceInitialState,
} from "./slice/locationSlice";
import * as Redux from "redux";
import cartReducer from "./slice/cartSlice";
import doctorProfileReducer from "./slice/doctorProfileSlice";
import { DoctorProfile, UserProfile } from "@/types/responses/profile";
import { InitialCartState } from "./slice/cartSlice";

interface PersistPartial {
	_persist: PersistState;
}

interface ReduxReducer {
	profile: UserProfile;
	doctorProfile: DoctorProfile & { email: string };
	location: LocationSliceInitialState;
	cart: InitialCartState;
}

const enableBatching = <T>(reducer: Redux.Reducer<T>): Redux.Reducer<T> => {
	return function batchingReducer(state: any, action: any) {
		switch (action.type) {
			case "BATCH_ACTIONS":
				return action.actions.reduce(batchingReducer, state);
			default:
				return reducer(state, action);
		}
	};
};

export const batchActions = (...actions: any[]) => {
	return {
		type: "BATCH_ACTIONS",
		actions: actions,
	};
};

export const makeStore = () => {
	const persistConfig = {
		key: process.env.NEXT_PUBLIC_FINGERPRINT_NAME as string,
		storage,
	};

	const rootReducer = combineReducers({
		profile: profileReducer,
		location: locationReducer,
		doctorProfile: doctorProfileReducer,
		cart: cartReducer,
	});

	const persistedReducer = persistReducer(persistConfig, rootReducer);
	const store = configureStore({
		reducer: enableBatching<ReduxReducer & PersistPartial>(persistedReducer),
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}),
	});

	// @ts-ignore
	store.__persistor = persistStore(store);

	return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
const wrapper = createWrapper(makeStore);

export default wrapper;
