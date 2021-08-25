import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
// import axios from "axios";
import axiosInstance from "../../axios";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../../Store";
import { updateUserNickname } from "../../actions";

const Nickname = (): JSX.Element => {
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;

	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const tokenState = useSelector((state: RootReducerType) => state.tokenReducer);

	const [errorMsg, setErrorMsg] = useState("");

	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangeNickname = async () => {
		if (userState.user.nickname === nickname) {
			setErrorMsg("새로운 닉네임을 입력해주세요.");
			return;
		}

		await axiosInstance({
			method: "PATCH",
			url: `${API_URL}/user/mypage/nickname`,
			data: {
				nickname: nickname,
				password: password,
			},
			headers: {
				authorization: `Bearer ${tokenState.accessToken}`,
			},
			withCredentials: true,
		})
			.then(resp => {
				setNickname("");
				setPassword("");
				resetErrorMsg();
				setNickname(resp.data.data.userInfo.nickname);
				dispatch(updateUserNickname(resp.data.data.userInfo));
				console.log("수정 완료");
				alert("회원정보가 수정되었습니다.");
			})
			.catch(err => {
				if (err.response) {
					if (err.response.status === 403) {
						setErrorMsg("비밀번호를 다시 확인해주세요.");
					} else if (err.response.status === 409) {
						setErrorMsg("이미 사용 중인 닉네임입니다.");
					}
				}
			});
	};

	return (
		<>
			<h2>Change Nickname</h2>
			<div className="form">
				<label>
					<input
						type="text"
						name="change-nickname"
						value={nickname}
						placeholder="변경할 닉네임을 입력하세요"
						onChange={e => setNickname(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
						name="password"
						value={password}
						placeholder={
							userState.user.signUpType === "email" || userState.user.signUpType === "intergration"
								? "비밀번호를 입력하세요"
								: "비밀번호 등록 전입니다"
						}
						disabled={
							userState.user.signUpType === "email" || userState.user.signUpType === "intergration" ? false : true
						}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<button onClick={handleChangeNickname}>닉네임 변경</button>
				<div className="mypage__alert-box">{errorMsg}</div>
			</div>
		</>
	);
};

export default Nickname;
