export interface SessionData {
	access_token: string;
	refresh_token: string;
	role: string;
	profile_set: boolean;
}

export const defaultSession: SessionData = {
	access_token: "",
	refresh_token: "",
	role: "",
	profile_set: false,
};
