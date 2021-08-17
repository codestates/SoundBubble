import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType } from "../../Store";

const Password = (): JSX.Element => {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRe, setNewPasswordRe] = useState("");
	const history = useHistory();
	const URL = process.env.REACT_APP_API_URL;
	const accessToken = localStorage.getItem("accessToken");

	// const dispatch = useDispatch();
	const [errorMsg, setErrorMsg] = useState("");
	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangePassword = () => {
		axios({
			method: "PATCH",
			url: `${URL}/user/mypage/password`,
			data: {
				password: password,
				newPassword: newPassword,
			},
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		})
			.then(resp => {
				console.log("수정 완료");
				history.push("/mypage/password");
				alert("비밀번호가 수정되었습니다.");
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<>
			<h2>Change Password</h2>
			<div>
				<label>
					<input
						type="password"
						name="changePassword"
						placeholder="기존 비밀번호"
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
						name="changePassword"
						placeholder="새 비밀번호"
						onChange={e => setNewPassword(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
						name="same-changePassword"
						placeholder="새 비밀번호 확인"
						onChange={e => setNewPasswordRe(e.target.value)}
					/>
				</label>
				<button onClick={handleChangePassword}>비밀번호 변경</button>
			</div>
		</>
	);
};

export default Password;
