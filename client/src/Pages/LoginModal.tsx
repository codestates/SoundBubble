import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import "./Styles/LoginModal.css";

const LoginModal = (): JSX.Element => {
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	const history = useHistory();
	const URL = process.env.REACT_APP_API_URL;

	const handleLogin = () => {
		axios({
			method: "POST",
			url: `${URL}/user/login`,
			data: {
				email: ID,
				password: PW,
			},
		})
			.then(res => {
				console.log(res);
				history.push("/main");
			})
			.catch(err => console.log(err));
	};

	return (
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
	);
};

export default LoginModal;
