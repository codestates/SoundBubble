export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const EDIT_NICKNAME = "EDIT_NICKNAME";
export const EDIT_PASSWORD = "EDIT_PASSWORD";
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

export const loginUser = (userInfo: UserInfo, accessToken: string | null): any => {
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

export const editNickname = (nickname: string, accessToken: string | null): any => {
	return {
		type: EDIT_NICKNAME,
		payload: { nickname, accessToken },
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
