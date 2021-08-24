import { UserInfo } from "../@type/userInfo";
import { IAction, PayloadToken, PayloadUserInfo } from "../@type/redux";

//? 타입 선언
export const SET_USER_INFO = "SET_USER_INFO";
export const REMOVE_USER_INFO = "REMOVE_USER_INFO";
export const UPDATE_USER_NICKNAME = "UPDATE_USER_NICKNAME";
export const UPDATE_USER_TYPE = "UPDATE_USER_TYPE";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const REMOVE_ACCESS_TOKEN = "REMOVE_ACCESS_TOKEN";

//? 액션 생성 함수 정의
//* 유저 정보 저장
export const setUserInfo = (userInfo: UserInfo): IAction<PayloadUserInfo> => {
	return {
		type: SET_USER_INFO,
		payload: { userInfo },
	};
};

//* 유저 정보 삭제
export const removeUserInfo = (): IAction<null> => {
	return {
		type: REMOVE_USER_INFO,
		payload: null,
	};
};

//* 유저 닉네임 변경
export const updateUserNickname = (userInfo: UserInfo): IAction<PayloadUserInfo> => {
	return {
		type: UPDATE_USER_NICKNAME,
		payload: { userInfo },
	};
};

//* 유저 타입 변경
export const updateUserType = (userInfo: UserInfo): IAction<PayloadUserInfo> => {
	return {
		type: UPDATE_USER_TYPE,
		payload: { userInfo },
	};
};

//* 액세스 토큰 저장
export const setAccessToken = (accessToken: string): IAction<PayloadToken> => {
	return {
		type: SET_ACCESS_TOKEN,
		payload: { accessToken },
	};
};

//* 액세스 토큰 삭제
export const removeAccessToken = (): IAction<null> => {
	return {
		type: REMOVE_ACCESS_TOKEN,
		payload: null,
	};
};
