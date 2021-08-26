import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
// import axios from "axios";
import axiosInstance from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType } from "../../Store";
import { pwIsValid } from "../../Utils/Validator";
import { updateUserType } from "../../actions";

const Password = (): JSX.Element => {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRe, setNewPasswordRe] = useState("");
	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;

	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	// const tokenState = useSelector((state: RootReducerType) => state.tokenReducer);

	const [errorMsg, setErrorMsg] = useState("");
	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangePassword = () => {
		if (newPassword === "" && newPasswordRe === "") {
			setErrorMsg("비밀번호를 입력해주세요.");
			return;
		}
		if (userState.user.signUpType === "email" || userState.user.signUpType === "intergration") {
			if (password === "") {
				setErrorMsg("비밀번호를 입력해주세요.");
				return;
			}
		}
		if (!pwIsValid(newPassword)) {
			setErrorMsg("비밀번호는 숫자와 영어 8글자 이상으로 이루어져야 합니다.");
		}
		if (newPassword !== newPasswordRe) {
			setErrorMsg("두 비밀번호가 맞지 않습니다. 새 비밀번호를 다시 확인해주세요");
			return;
		}

		axiosInstance({
			method: "PATCH",
			url: `${API_URL}/user/mypage/password`,
			data: {
				password: password,
				newPassword: newPassword,
			},
			withCredentials: true,
		})
			.then(resp => {
				setPassword("");
				setNewPassword("");
				setNewPasswordRe("");
				console.log("수정 완료");
				console.log("응답값", resp.data);
				resetErrorMsg();
				dispatch(updateUserType(resp.data.data.userInfo));
				alert("비밀번호가 수정되었습니다.");
			})
			.catch(err => {
				if (err.response) {
					if (err.response.status === 403) {
						setErrorMsg("기존 비밀번호를 다시 확인해주세요.");
					} else if (err.response.status === 409) {
						setErrorMsg("기존과 동일한 비밀번호로 변경할 수 없습니다.");
					}
				}
			});
	};

	return (
		<>
			<h2>Change Password</h2>
			<div className="form">
				<label>
					<input
						type="password"
						name="changePassword"
						value={password}
						placeholder={
							userState.user.signUpType === "email" || userState.user.signUpType === "intergration"
								? "기존 비밀번호"
								: "비밀번호 등록 시 일반 로그인을 이용할 수 있습니다"
						}
						disabled={
							userState.user.signUpType === "email" || userState.user.signUpType === "intergration" ? false : true
						}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
						name="changePassword"
						value={newPassword}
						placeholder="새 비밀번호"
						onChange={e => setNewPassword(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
						name="same-changePassword"
						value={newPasswordRe}
						placeholder="새 비밀번호 확인"
						onChange={e => setNewPasswordRe(e.target.value)}
					/>
				</label>
				<button onClick={handleChangePassword}>비밀번호 변경</button>
				<div className="mypage__alert-box">{errorMsg}</div>
			</div>
		</>
	);
};

export default Password;
