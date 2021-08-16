import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/index";
import { RootReducerType } from "../Store";
import "./Styles/LoginModal.css";

const LoginModal = (): JSX.Element => {
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	const history = useHistory();
	const URL = process.env.REACT_APP_API_URL;

	// ! ###### test zone ######
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	// ! ###### test zone ######

	const handleLogin = () => {
		axios({
			method: "POST",
			url: `${URL}/user/login`,
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
						<div className="social-login-group">소셜 로그인 버튼</div>
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
