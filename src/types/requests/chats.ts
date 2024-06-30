export interface Chat {
	doctor_id: number;
}

export interface CloseChat {
	room_id: string;
}

export interface SendDoctorNotes {
	room_id: number;
	message:string;
	user_id: number;
}