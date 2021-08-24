import { UserInfo } from "./userInfo";

//* 타입: 상태 초기 값
export interface InitialState {
	user: UserInfo;
	accessToken: string;
}

//* 타입: 액션 생성 함수의 반환 액션
export interface IAction<T extends string, P> {
	type: T;
	payload: P;
}

//* 타입: 액션 생성 함수의 반환 payload 값
export type PayloadUserInfo = { userInfo: UserInfo };
export type PayloadToken = { accessToken: string };