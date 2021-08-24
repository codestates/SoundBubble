import { SET_ACCESS_TOKEN, REMOVE_ACCESS_TOKEN, setAccessToken, removeAccessToken } from "../actions";
import { InitialState } from "../@type/redux";
import { initialState } from "./initialState";

type TokenAction = ReturnType<typeof setAccessToken | typeof removeAccessToken>;

const tokenReducer = (state = initialState, action: TokenAction): InitialState => {
	switch (action.type) {
		case SET_ACCESS_TOKEN:
			const accessToken: string = action.payload.accessToken;
			return Object.assign({}, state, {
				accessToken: accessToken,
			});

		case REMOVE_ACCESS_TOKEN:
			return Object.assign({}, state, {
				accessToken: initialState.accessToken,
			});

		default:
			return state;
	}
};

export default tokenReducer;
