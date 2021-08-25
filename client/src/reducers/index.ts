import userReducer from "./userReducer";
// import tokenReducer from "./tokenReducer";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist"; // 추가
import storage from "redux-persist/lib/storage"; // local storage에 저장
// import storageSession from "redux-persist/lib/storage/session"; // session storage에 저장

const persistConfig = {
	key: "root",
	// localStorage에 저장합니다.
	storage,
	// auth, board, studio 3개의 reducer 중에 auth reducer만 localstorage에 저장합니다.
	whitelist: ["userReducer"],
	// blacklist -> 그것만 제외합니다
};

const rootReducer = combineReducers({
	userReducer,
});

// export default rootReducer;
export default persistReducer(persistConfig, rootReducer);
