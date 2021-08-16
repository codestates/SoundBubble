export const INCREASE_NUMBER = "INCREASE_NUMBER";
export const DECREASE_NUMBER = "DECREASE_NUMBER";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const ACCESS_TOKEN_AUTHENTICAITON = "ACCESS_TOKEN_AUTHENTICAITON";
export const REFRESH_TOKEN_AUTHENTICAITON = "REFRESH_TOKEN_AUTHENTICAITON";

interface UserInfo {
	email: string;
	nickname: string;
	accessToken: string;
	profileImage?: string;
	signUpType?: string;
	refreshToken?: string;
}

export const increaseNumber = () => {
	return {
		type: INCREASE_NUMBER,
	};
};
export const decreaseNumber = () => {
	return {
		type: DECREASE_NUMBER,
	};
};

export const loginUser = (userInfo: UserInfo): any => {
	return {
		type: LOGIN_USER,
		payload: userInfo,
	};
};

export const logoutUser = () => {
	return {
		type: LOGOUT_USER,
	};
};

export const accessTokenAuthentication = () => {
	return {
		type: ACCESS_TOKEN_AUTHENTICAITON,
	};
};

export const refreshTokenAuthentication = () => {
	return {
		type: REFRESH_TOKEN_AUTHENTICAITON,
	};
};
