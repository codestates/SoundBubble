import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import store from "../Store";
import { removeUserInfo } from "../actions";

const { dispatch } = store; // redux store에 바로 접근 (Hook 사용 불가)

//* axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	timeout: 1000,
});

//* 응답 인터셉터 등록
axiosInstance.interceptors.response.use(
	function (res: AxiosResponse) {
		console.log("응답 인터셉터!");
		// if (res.headers.authorization) {
		// 	console.log("액세스 토큰 재발급");
		// 	const newAccessToken: string = res.headers.authorization.split("Bearer ")[1];
		// 	dispatch(setAccessToken(newAccessToken));
		// }
		return res;
	},

	function (err: AxiosError) {
		if (err.response && err.response.status === 401) {
			// 사용자 재로그인 필요 (모달창 + 로그인 페이지로 이동);
			alert("로그인 상태가 만료되었습니다. 재로그인 해주세요");
			dispatch(removeUserInfo());
			// dispatch(removeAccessToken());
			window.location.replace("/login");
		}
		return Promise.reject(err);
	},
);

export default axiosInstance;
