import {
	loginUser,
	editNickname,
	LOGIN_USER,
	LOGOUT_USER,
	ACCESS_TOKEN_AUTHENTICAITON,
	REFRESH_TOKEN_AUTHENTICAITON,
	EDIT_NICKNAME,
} from "../actions/index";

interface InitialState {
	id: number;
	email: string;
	nickname: string;
	createdAt: string;
	accountType: string;
	signUpType: string;
	accessToken: string;
	profileImage?: string;
}

type UserInfoAction = ReturnType<typeof loginUser | typeof editNickname>;

const initialState: InitialState = {
	id: 0,
	email: "",
	nickname: "",
	createdAt: "",
	accountType: "",
	signUpType: "",
	accessToken: "",
	profileImage: "",
};

const userReducer = (state = initialState, action: UserInfoAction): InitialState => {
	switch (action.type) {
		case LOGIN_USER:
			const { userInfo, accessToken } = action.payload;
			return Object.assign({}, state, {
				id: userInfo.id,
				email: userInfo.email,
				nickname: userInfo.nickname,
				createdAt: userInfo.createdAt,
				accountType: userInfo.accountType,
				signUpType: userInfo.signUpType,
				profileImage: userInfo.profileImage,
				accessToken: accessToken,
			});

		case LOGOUT_USER:
			return Object.assign({}, state, {
				id: "",
				email: "",
				nickname: "",
				createdAt: "",
				accountType: "",
				signUpType: "",
				accessToken: "",
				profileImage: "",
			});

		case EDIT_NICKNAME:
			return Object.assign({}, state, {
				nickname: action.payload.nickname,
			});

		// case ACCESS_TOKEN_AUTHENTICAITON:
		// 	return Object.assign({}, state, {
		// 		accessToken: action.payload.accessToken,
		// 	});

		// case REFRESH_TOKEN_AUTHENTICAITON:
		// 	return Object.assign({}, state, {
		// 		refreshToken: action.payload.refreshToken,
		// 	});
		default:
			return state;
	}
};

export default userReducer;
