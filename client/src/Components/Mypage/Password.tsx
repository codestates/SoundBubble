import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType } from "../../Store";
import { pwIsValid } from "../../Utils/Validator";
import { editUserInfo } from "../../actions";

const Password = (): JSX.Element => {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRe, setNewPasswordRe] = useState("");
	const history = useHistory();
	const URL = process.env.REACT_APP_API_URL;

	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);

	const [errorMsg, setErrorMsg] = useState("");
	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangePassword = () => {
		if (!pwIsValid(newPassword)) {
			setErrorMsg("비밀번호는 숫자와 영어 8글자 이상으로 이루어져야 합니다.");
		} else if (newPassword !== newPasswordRe) {
			setErrorMsg("새 비밀번호를 다시 확인해주세요");
		} else {
			axios({
				method: "PATCH",
				url: `${URL}/user/mypage/password`,
				data: {
					password: password,
					newPassword: newPassword,
				},
				headers: {
					authorization: `Bearer ${state.accessToken}`,
				},
			})
				.then(resp => {
					setPassword("");
					setNewPassword("");
					setNewPasswordRe("");
					console.log("수정 완료");
					console.log("응답값", resp.data);
					resetErrorMsg();
					// window.location.replace("/mypage/password"); // history.push를 사용하면 새로고침이 안됨
					dispatch(editUserInfo(resp.data.data.userInfo));
					alert("비밀번호가 수정되었습니다.");
				})
				.catch(err => {
					console.log(err);
				});
		}
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
							state.signUpType === "email" || state.signUpType === "intergration"
								? "기존 비밀번호"
								: "비밀번호 등록 시 일반 로그인을 이용할 수 있습니다"
						}
						disabled={state.signUpType === "email" || state.signUpType === "intergration" ? false : true}
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
