import numberReducer from "./numberReducer";
import user from "./user";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
	numberReducer,
	user,
});

export default rootReducer;
