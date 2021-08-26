import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../actions";
import { RootReducerType } from "../Store";
import "./Styles/LoginModal.css";
import Swal from "sweetalert2";

const LoginModal = (): JSX.Element => {
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const history = useHistory();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const API_URL = process.env.REACT_APP_API_URL;

	//* Normal login
	const handleLogin = () => {
		if (ID === "" && PW === "") {
			setErrorMsg("이메일과 비밀번호를 입력해주세요.");
			return;
		}else if (ID === "") {
			setErrorMsg("이메일을 입력해주세요.");
			return;
		} else if (PW === "") {
			setErrorMsg("비밀번호를 입력해주세요.");
			return;
		}

		axios({
			method: "POST",
			url: `${API_URL}/user/login`,
			data: {
				email: ID,
				password: PW,
			},
			withCredentials: true,
		})
			.then(resp => {
				setErrorMsg("");
				const { userInfo } = resp.data.data;
				dispatch(setUserInfo(userInfo));
				history.push("/main");
			})
			.catch(() => {
				setErrorMsg("");
				Swal.fire({
					text: "이메일과 비밀번호를 확인해주세요.",
					icon: "warning",
					confirmButtonText: "확인",
				});
			});
	};

	//* Social login
	useEffect(() => {
		const url = new URL(window.location.href);
		const authorizationCode = url.searchParams.get("code");

		if (authorizationCode) {
			handleSocialLogin(authorizationCode);
		}
	}, []);

	const handleSocialLogin = async authorizationCode => {
		const socialType = localStorage.getItem("socialType");
		await axios({
			method: "POST",
			url: `${API_URL}/user/login/${socialType}`,
			data: {
				authorizationCode: authorizationCode,
			},
			withCredentials: true,
		})
			.then(res => {
				const { userInfo } = res.data.data;
				dispatch(setUserInfo(userInfo));
				console.log("LoginModal: userState", userState);
				history.push("/main");
			})
			.catch(err => {
				console.log(err);
				if (socialType === "naver" && err.response.status === 406) {
					alert(
						"반드시 이메일과 별명 항목을 제공해 주셔야 가입이 가능합니다. '네이버와 연결된 서비스 관리'에서 SoundBubble을 철회한 후 다시 시도해주세요",
					);
				}
			})
			.finally(() => {
				localStorage.removeItem("socialType");
			});
	};

	const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
	const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
	const redirect_uri = process.env.REACT_APP_REDIRECT_URL;
	const naver_redirect_uri = process.env.REACT_APP_NAVER_REDIRECT_URL;

	const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email&access_type=offline`;
	const NAVER_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_client_id}&redirect_uri=${naver_redirect_uri}&state=naverstate`;

	const googleLoginHandler = () => {
		localStorage.setItem("socialType", "google");
		window.location.assign(GOOGLE_LOGIN_URL);
	};

	const naverLoginHandler = () => {
		localStorage.setItem("socialType", "naver");
		window.location.assign(NAVER_LOGIN_URL);
	};

	return (
		<>
			<div className="login-body">
				<aside className="login-sidebar-content">
					<header className="login-header"></header>
					<img />
				</aside>
				<main className="login-main">
					<header className="login-top-content"></header>
					<div className="login-content">
						<h2>Login to SoundBubble</h2>
						<div className="social-login-group">
							<button type="button" className="login-naver-btn" onClick={naverLoginHandler}>
								Sign in with Naver
							</button>
							<button type="button" className="login-google-btn" onClick={googleLoginHandler}>
								Sign in with Google
							</button>
						</div>
						<hr className="login-divider" />
						<fieldset className="login-user-email">
							<label className="login-label">Email</label>
							<input className="login-input-email" type="email" onChange={e => setID(e.target.value)} />
						</fieldset>
						<fieldset className="login-user-password">
							<label className="login-label">Password</label>
							<input className="login-input-password" type="password" onChange={e => setPW(e.target.value)} />
						</fieldset>
						<div className="login-alert-box">{errorMsg}</div>
						<div className="login-form-btn">
							<button onClick={handleLogin}>Login</button>
							<button onClick={() => history.push("/signup")}>Sign Up</button>
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default LoginModal;
