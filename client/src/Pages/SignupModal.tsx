import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { emailIsValid, pwIsValid } from "../Utils/Validator";
import "./Styles/SignupModal.css";
import Modal from "../Components/Modal";

const SignupModal = (): JSX.Element => {
	const [name, setName] = useState("");
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	const [RePW, setRePW] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const URL = process.env.REACT_APP_API_URL;
	const history = useHistory();
	const [isModal, setIsModal] = useState(false);

	const handleCloseModal = () => {
		setIsModal(false);
	};

	const handleSamePW = (PW: string, RePW: string) => {
		return PW === RePW ? true : false;
	};

	const handleSignUp = () => {
		setErrorMsg("");
		if (!emailIsValid(ID)) {
			setErrorMsg("ID는 이메일 형식입니다.");
			setIsModal(true);
			return;
		}
		if (!pwIsValid(PW)) {
			setErrorMsg("비밀번호는 숫자와 영어 8글자 이상으로 이루어져야 합니다.");
			return;
		}
		if (handleSamePW(PW, RePW)) {
			axios({
				method: "POST",
				url: `${URL}/user/signup`,
				data: {
					email: ID,
					password: PW,
					nickname: name,
				},
				withCredentials: true,
			})
				.then(() => window.history.back())
				.catch(err => console.log(err));
		} else {
			setErrorMsg("비밀번호가 일치하지 않습니다.");
		}
	};

	return (
		<>
			{isModal ? <Modal handleCloseModal={handleCloseModal} /> : null}
			<div className="signup-body">
				<aside className="signup-sidebar-content">
					<header className="signup-header"></header>
					<img />
				</aside>
				<main className="signup-main">
					<div className="signup-content">
						<h2>Sign up to soundBubble</h2>
						<hr className="divider" />
						<fieldset className="signup-user-name">
							<label className="signup-label">Name</label>
							<input className="signup-input-name" type="text" onChange={e => setName(e.target.value)} />
						</fieldset>
						<fieldset className="signup-user-email">
							<label className="signup-label">Email</label>
							<input className="signup-input-email" type="email" onChange={e => setID(e.target.value)} />
						</fieldset>
						<div className="signup-password-group">
							<fieldset className="signup-user-password">
								<label className="signup-label">Password</label>
								<input className="signup-input-password" type="password" onChange={e => setPW(e.target.value)} />
							</fieldset>
							<fieldset className="signup-user-RePassword">
								<label className="signup-label">Re-Password</label>
								<input className="signup-input-RePassword" type="password" onChange={e => setRePW(e.target.value)} />
							</fieldset>
						</div>
						<div className="signup-alert-box">{errorMsg}</div>
						<div className="signup-form-btn">
							<button onClick={handleSignUp}>Create Account</button>
							<button onClick={() => history.push("/login")}>Go To Login</button>
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default SignupModal;
