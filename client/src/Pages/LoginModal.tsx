import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/index";
import { RootReducerType } from "../Store";
import GoogleButton from "react-google-button";
// import * as url from "url";
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

	//! google social login 
	//? --------------------------------------------------------------
	useEffect(() => {
    const url = new URL(window.location.href);
		const authorizationCode = url.searchParams.get("code");
		const isNaver = window.location.href.indexOf("google");

		if (authorizationCode) {
			// 어떤 로그인 버튼을 눌렀는지에 따라서 다른 엔드포인트로 요청 -> 다른 상태 사용
			console.log("authorizationCode", authorizationCode);
			Naver();
			getAuth(authorizationCode);
      getSocialInfo(authorizationCode); // 서버에 AJAX call
		}
	}, []);
	
	const getSocialInfo = async (authorizationCode) => {
    await axios
      .post(`${API_URL}/user/login/naver`, {
        authorizationCode: authorizationCode,
      })
			.then((res) => {
				const { accessToken, userInfo } = res.data.data;
        dispatch(loginUser(userInfo, accessToken));
        history.push("/main");
      });
  };

	const google_client_id =
	"871862507517-g22r0ffes8kkvdea1k5d0be6mc3o56gm.apps.googleusercontent.com";
	const redirect_uri = "http://localhost:3000/login";

	const GOOGLE_LOGIN_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email&access_type=offline`;
	
	const googleLoginHandler = () => {
    window.location.assign(GOOGLE_LOGIN_URL);
	};
	
	//! naver social login
	const naver_client_id = "Xy5YQnQ5GJ2NOz0Q6959";
	const NAVER_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=${naver_client_id}&response_type=code&redirect_uri=${redirect_uri}&state=naverstate`;
	const loginUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=Xy5YQnQ5GJ2NOz0Q6959&redirect_uri=http://localhost:3000/login&state=naverstate";
	const NAVER_TOKEN_URL = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=Xy5YQnQ5GJ2NOz0Q6959&client_secret=ghtDlbOEz6&redirect_uri=http://localhost:3000/login&code=ukwKG4jWxnZpmc7BbY&state=naverstate`
	const Naver = () => {
		const naverLogin = new naver.LoginWithNaverId({
			clientId: naver_client_id,
			callbackUrl: redirect_uri,
			isPopup: false,
			callbackHandle: true,
			loginButton: { color: 'white', type: 1, height: '50' }
		});
		naverLogin.init();
	}

	const naverLoginHandler = () => {
		window.location.assign(loginUrl);
	}

	const getAuth = async (authorizationCode) => {
    await axios
			.post(`${API_URL}/user/login/naver`, {
				client_id: process.env.NAVER_CLIENT_ID,
				client_secret: process.env.NAVER_CLIENT_SECRET,
				code: authorizationCode,
				redirect_uri: redirect_uri,
      })
			.then((res) => {
				console.log(res);
				const { accessToken, userInfo } = res.data.data;
        dispatch(loginUser(userInfo, accessToken));
        history.push("/main");
			})
	}
	
	function getUser() {
		const location = useLocation();
		const token = location.hash.split("=")[1].split("&")[0];
		const header = {
			Authorization: token,
		}

		fetch('http://localhost:3000/user/login/naver', {
			method: 'get',
			headers: header,
		})
			.then(res => res.json())
			.then((res) => {
				const { accessToken, userInfo } = res.data.data;
        dispatch(loginUser(userInfo, accessToken));
        history.push("/main");
			})
	}

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
							<GoogleButton
								className="login-google-btn"
                type="light"
                onClick={googleLoginHandler}
                data-border-radius="5px"
							/>
							<div id="naverIdLogin" onClick={naverLoginHandler} />
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
