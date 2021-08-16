export const INCREASE_NUMBER = "INCREASE_NUMBER";
export const DECREASE_NUMBER = "DECREASE_NUMBER";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const ACCESS_TOKEN_AUTHENTICAITON = "ACCESS_TOKEN_AUTHENTICAITON";
export const REFRESH_TOKEN_AUTHENTICAITON = "REFRESH_TOKEN_AUTHENTICAITON";

interface UserInfo {
	id: number;
	email: string;
	nickname: string;
	createdAt: string;
	accountType: string;
	signUpType: string;
	profileImage?: string;
}

interface AccessToken {
	accessToken: string;
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

export const loginUser = (userInfo: UserInfo, accessToken: AccessToken): any => {
	return {
		type: LOGIN_USER,
		payload: { userInfo, accessToken },
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
