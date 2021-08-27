import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { emailIsValid, pwIsValid } from "../Utils/Validator";
import "./Styles/SignupModal.css";
import Modal from "../Components/Modal";
import Swal from "sweetalert2";
import { IoMdReturnLeft } from "react-icons/io";
import { runInContext } from "vm";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const SignupModal = (): JSX.Element => {
	const [name, setName] = useState("");
	const [ID, setID] = useState("");
	const [PW, setPW] = useState("");
	const [RePW, setRePW] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const API_URL = process.env.REACT_APP_API_URL;
	const history = useHistory();
	const [isModal, setIsModal] = useState(false);

	const [nameChecked, setNameChecked] = useState(false);
	const [emailChecked, setEmailChecked] = useState(false);

	const userState = useSelector((state: RootReducerType) => state.userReducer);

	useEffect(() => {
		if (userState.user.id >= 0) {
			history.push("/mypage");
		}
	}, []);

	const handleCloseModal = () => {
		setIsModal(false);
	};

	const handleSamePW = (PW: string, RePW: string) => {
		return PW === RePW ? true : false;
	};

	const handleSignUp = () => {
		setErrorMsg("");
		if (name === "" || ID === "" || PW === "" || RePW === "") {
			setErrorMsg("모든 항목을 입력해주세요.");
			return;
		}
		if (!pwIsValid(PW)) {
			setErrorMsg("비밀번호는 숫자와 영어 8글자 이상으로 이루어져야 합니다.");
			return;
		}
		if (!nameChecked || !emailChecked) {
			setErrorMsg("이름과 이메일 모두 중복 확인을 해주세요.");
			return;
		}

		if (handleSamePW(PW, RePW)) {
			axios({
				method: "POST",
				url: `${API_URL}/user/signup`,
				data: {
					email: ID,
					password: PW,
					nickname: name,
				},
				// withCredentials: true,
			})
				.then(resp => {
					setErrorMsg("");
					Swal.fire({
						text: "회원가입이 완료되었습니다.",
						icon: "success",
						confirmButtonText: "확인",
					}).then(() => {
						history.push("/login");
					});
				})
				.catch(err => {
					setErrorMsg("");
					if (err.response.status === 409) {
						if (err.response.data.message === "Nickname already in use") {
							Swal.fire({
								text: "이미 사용 중인 이름입니다.",
								icon: "warning",
								confirmButtonText: "확인",
							});
						} else {
							Swal.fire({
								text: "이미 사용 중인 이메일입니다.",
								icon: "warning",
								confirmButtonText: "확인",
							});
						}
					} else {
						Swal.fire({
							text: "회원가입에 실패하였습니다.",
							icon: "warning",
							confirmButtonText: "확인",
						});
					}
				});
		} else {
			setErrorMsg("두 비밀번호가 일치하지 않습니다.");
		}
	};

	const handleCheckName = () => {
		setErrorMsg("");
		if (nameChecked) {
			return;
		}
		if (name === "") {
			setErrorMsg("이름을 입력해주세요.");
			return;
		}

		axios({
			method: "POST",
			url: `${API_URL}/user/check/nickname`,
			data: {
				nickname: name,
			},
		})
			.then(() =>
				Swal.fire({
					text: "사용할 수 있는 이름입니다. 사용하시겠습니까?",
					icon: "question",
					showCancelButton: true,
					confirmButtonText: "예",
					cancelButtonText: "아니오",
				}).then(result => {
					if (result.isConfirmed) {
						setNameChecked(true);
					}
				}),
			)
			.catch(() => {
				Swal.fire({
					text: "이미 사용 중인 이름입니다.",
					icon: "warning",
					confirmButtonText: "확인",
				});
			});
	};

	const handleCheckEmail = () => {
		setErrorMsg("");
		if (emailChecked) {
			return;
		}
		if (ID === "") {
			setErrorMsg("이메일을 입력해주세요.");
			return;
		}
		if (!emailIsValid(ID)) {
			setErrorMsg("올바른 이메일 형식이 아닙니다.");
			return;
		}

		axios({
			method: "POST",
			url: `${API_URL}/user/check/email`,
			data: {
				email: ID,
			},
		})
			.then(() =>
				Swal.fire({
					text: "사용할 수 있는 이메일입니다. 사용하시겠습니까?",
					icon: "question",
					showCancelButton: true,
					confirmButtonText: "예",
					cancelButtonText: "아니오",
				}).then(result => {
					if (result.isConfirmed) {
						setEmailChecked(true);
					}
				}),
			)
			.catch(() => {
				Swal.fire({
					text: "이미 사용 중인 이메일입니다.",
					icon: "warning",
					confirmButtonText: "확인",
				});
			});
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
					<header className="signup-top-content"></header>
					<div className="signup-content">
						<h2>Sign up to soundBubble</h2>
						<hr className="divider" />
						<fieldset className="signup-user-name">
							<label className="signup-label">Name</label>
							<input
								className={nameChecked ? "signup-input-name input-checked" : "signup-input-name"}
								type="text"
								onChange={e => setName(e.target.value)}
								disabled={nameChecked ? true : false}
							/>
							<button
								className={nameChecked ? "signup-check-btn signup-checked" : "signup-check-btn signup-unckecked"}
								onClick={handleCheckName}
							>
								이름 중복 확인
							</button>
						</fieldset>
						<fieldset className="signup-user-email">
							<label className="signup-label">Email</label>
							<input
								className={emailChecked ? "signup-input-email input-checked" : "signup-input-name"}
								type="email"
								onChange={e => setID(e.target.value)}
								disabled={emailChecked ? true : false}
							/>
							<button
								className={emailChecked ? "signup-check-btn signup-checked" : "signup-check-btn signup-unckecked"}
								onClick={handleCheckEmail}
							>
								이메일 중복 확인
							</button>
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
