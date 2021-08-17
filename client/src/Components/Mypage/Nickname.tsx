import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const Nickname = (): JSX.Element => {
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();
	const url = process.env.REACT_APP_API_URL;
	const accessToken = localStorage.getItem("accessToken");

	// const dispatch = useDispatch();

	const [errorMsg, setErrorMsg] = useState("");
	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangeNickname = () => {
		axios({
			method: "PATCH",
			url: `${url}/user/mypage/nickname`,
			data: {
				nickname: nickname,
				password: password,
			},
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		})
			.then(resp => {
				console.log("수정 완료");
				history.push("/mypage");
				alert("회원정보가 수정되었습니다.");
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<>
			<h2>Change Nickname</h2>
			<div>
				<label>
					<input
						type="text"
						name="change-nickname"
						placeholder="닉네임을 입력하세요"
						onChange={e => setNickname(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="text"
						name="password"
						placeholder="비밀번호를 입력하세요"
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
