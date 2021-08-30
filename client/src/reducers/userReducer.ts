import {
	SET_USER_INFO,
	REMOVE_USER_INFO,
	UPDATE_USER_NICKNAME,
	UPDATE_USER_TYPE,
	setUserInfo,
	removeUserInfo,
	updateUserNickname,
	updateUserType,
} from "../actions";
import { InitialState } from "../@type/redux";
import { initialState } from "./initialState";
import { UserInfo, SignUpType } from "../@type/userInfo";

type UserAction = ReturnType<
	typeof setUserInfo | typeof removeUserInfo | typeof updateUserNickname | typeof updateUserType
>;

const userReducer = (state = initialState, action: UserAction): InitialState => {
	switch (action.type) {
		case SET_USER_INFO:
			const userInfo: UserInfo = action.payload.userInfo;
			return Object.assign({}, state, {
				user: userInfo,
			});

		case REMOVE_USER_INFO:
			return Object.assign({}, state, {
				user: initialState.user,
			});

		case UPDATE_USER_NICKNAME:
			const nickname: string = action.payload.userInfo.nickname
			return Object.assign({}, state, {
				user: {
					...state.user,
					nickname: nickname,
				},
			});

		case UPDATE_USER_TYPE:
			const signUpType: SignUpType = action.payload.userInfo.signUpType;
			return Object.assign({}, state, {
				user: {
					...state.user,
					signUpType: signUpType,
				},
			});

		default:
			return state;
	}
};

export default userReducer;
