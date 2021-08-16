import {
	loginUser,
	LOGIN_USER,
	LOGOUT_USER,
	ACCESS_TOKEN_AUTHENTICAITON,
	REFRESH_TOKEN_AUTHENTICAITON,
} from "../actions/index";

interface InitialState {
	email: string;
	nickname: string;
	accessToken: string;
	// profileImage?: string;
	// signUpType?: string;
	// refreshToken?: string;
}

type CounterAction = ReturnType<typeof loginUser>;

const initialState: InitialState = {
	email: "dummy@mail.com",
	nickname: "dummyName",
	accessToken: "dummy token",
	// profileImage: "",
	// signUpType: "",
	// refreshToken: "",
};

const numberReducer = (state = initialState, action: CounterAction): InitialState => {
	switch (action.type) {
		case LOGIN_USER:
			return Object.assign({}, state, {
				email: action.payload.email,
				nickname: action.payload.nickname,
				accessToken: action.payload.accessToken,
				// profileImage: action.payload.profileImage,
				// signUpType: action.payload.signUpType,
				// refreshToken: action.payload.refreshToken,
			});

		case LOGOUT_USER:
			return Object.assign({}, state, {
				email: "",
				nickname: "",
				profileImage: "",
				signUpType: "",
				accessToken: "",
				refreshToken: "",
			});

		case ACCESS_TOKEN_AUTHENTICAITON:
			return Object.assign({}, state, {
				accessToken: action.payload.accessToken,
			});

		case REFRESH_TOKEN_AUTHENTICAITON:
			return Object.assign({}, state, {
				refreshToken: action.payload.refreshToken,
			});
		default:
			return state;
	}
};

export default numberReducer;
