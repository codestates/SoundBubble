import numberReducer from "./numberReducer";
import userReducer from "./userReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
	numberReducer,
	userReducer,
});

export default rootReducer;
