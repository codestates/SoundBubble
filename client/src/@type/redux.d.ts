import { UserInfo } from "./userInfo";

//* 타입: 초기 상태
export interface InitialState {
	user: UserInfo;
	accessToken: string;
}

//* 타입: 액션 생성 함수의 반환 값 (액션 객체)
export interface IAction<T extends string, P> {
	type: T;
	payload: P;
}

//* 타입: 액션 생성 함수의 반환 payload 값 (액션 객체의 payload)
export type PayloadUserInfo = { userInfo: UserInfo };
export type PayloadToken = { accessToken: string };