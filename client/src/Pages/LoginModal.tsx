import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/index";
import { RootReducerType } from "../Store";
import "./Styles/LoginModal.css";

declare global {
	interface Window {
		naver: any;
	}
}

const { naver } = window;

const LoginModal = (): JSX.Element => {
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	// const [socialType, setSocialType] = useState("");

	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;

	// ! ###### test zone ######
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	// ! ###### test zone ######

	const handleLogin = () => {
		axios({
			method: "POST",
			url: `${API_URL}/user/login`,
			data: {
				email: ID,
				password: PW,
			},
		})
			.then(resp => {
				// ! ###### test zone ######
				// ? # login시 user-info와 access token을 받아두기
				const { accessToken, userInfo } = resp.data.data;
				dispatch(loginUser(userInfo, accessToken));
				// ! ###### test zone ######
				history.push("/main");
			})
			.catch(err => {
				console.log(err);
			});
	};

	//! social login
	useEffect(() => {
		const url = new URL(window.location.href);
		const authorizationCode = url.searchParams.get("code");

		if (authorizationCode) {	// url에 code가 있으면
			getSocialInfo(authorizationCode); // 서버에 AJAX call
		}
	}, []);

	const getSocialInfo = async authorizationCode => {
		await axios
			.post(`${API_URL}/user/login/${localStorage.getItem("socialType")}`, {
				authorizationCode: authorizationCode,
			})
			.then(res => {
				const { accessToken, userInfo } = res.data.data;
				dispatch(loginUser(userInfo, accessToken));
				history.push("/main");
			});
	};

	const google_client_id = "871862507517-g22r0ffes8kkvdea1k5d0be6mc3o56gm.apps.googleusercontent.com";
	const naver_client_id = "Xy5YQnQ5GJ2NOz0Q6959";
	const redirect_uri = "http://localhost:3000/login";

	const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email&access_type=offline`;
	const NAVER_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_client_id}&redirect_uri=${redirect_uri}&state=naverstate`;

	const googleLoginHandler = () => {
		// setSocialType("google");
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
					<div className="login-content">
						<h2>Login to soundBubble</h2>
						<div className="social-login-group">
							<div id="naverIdLogin" onClick={naverLoginHandler} />
							<button type="button" className="login-google-btn" onClick={googleLoginHandler}>
								Sign in with Google
							</button>
						</div>
						<hr className="divider" />
						<fieldset className="login-user-email">
							<label className="login-label">Email Address</label>
							<input className="login-input-email" type="email" onChange={e => setID(e.target.value)} />
						</fieldset>
						<fieldset className="login-user-password">
							<label className="login-label">Password</label>
							<input className="login-input-password" type="password" onChange={e => setPW(e.target.value)} />
						</fieldset>
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
