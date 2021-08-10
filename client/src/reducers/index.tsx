import numberReducer from "./numberReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  numberReducer,
});

export default rootReducer;
