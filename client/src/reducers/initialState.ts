import { InitialState } from "../@type/redux";

export const initialState: InitialState = {
	user: {
		id: -1,
		email: "",
		nickname: "",
		accountType: "",
		signUpType: "",
		profileImage: null,
		createdAt: "",
	},
};
