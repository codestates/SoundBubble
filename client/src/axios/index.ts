import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import store from "../Store";
import { removeUserInfo } from "../actions";
import Swal from "sweetalert2";

const { dispatch } = store; // redux store에 바로 접근 (Hook 사용 불가)

//* axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	timeout: 1000,
});

//* 응답 인터셉터 등록
axiosInstance.interceptors.response.use(
	function (res: AxiosResponse) {
		return res;
	},

	function (err: AxiosError) {
		if (err.response && err.response.status === 401) {
			Swal.fire({
				text: "로그인 상태가 만료되었습니다. 로그인 페이지로 이동합니다.",
				icon: "warning",
				confirmButtonText: "확인",
			}).then(() => {
				window.location.replace("/login");
				dispatch(removeUserInfo());
			});
		}
		return Promise.reject(err);
	},
);

export default axiosInstance;
