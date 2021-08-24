import { Action } from "redux";
import { UserInfo } from "./userInfo";

//* 타입: 초기 상태
export interface InitialState {
	user: UserInfo;
	accessToken: string;
}

//* 타입: 액션 생성 함수의 반환 값
export interface IAction<T> extends Action<string> {
	type: string;
	payload: T;
}

//* 타입: 액션 생성 함수의 인자
export type PayloadUserInfo = { userInfo: UserInfo };
export type PayloadToken = { accessToken: string };