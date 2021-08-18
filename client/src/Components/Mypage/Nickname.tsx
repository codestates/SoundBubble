import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../../Store";
import { editNickname } from "../../actions/index";

const Nickname = (): JSX.Element => {
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();
	const url = process.env.REACT_APP_API_URL;

	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);

	const [errorMsg, setErrorMsg] = useState("");

	const resetErrorMsg = () => {
		setErrorMsg("");
	};

	const handleChangeNickname = async () => {
		await axios({
			method: "PATCH",
			url: `${url}/user/mypage/nickname`,
			data: {
				nickname: nickname,
				password: password,
			},
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		})
			.then(resp => {
				resetErrorMsg();
				setNickname(resp.data.data.userInfo.nickname);
				console.log("수정 완료");
				window.location.replace("/mypage");
				alert("회원정보가 수정되었습니다.");
			})
			.catch(err => {
				if (err.response.status === 403) {
					setErrorMsg("비밀번호를 다시 확인해주세요.");
				}
				if (err.response.status === 409) {
					setErrorMsg("새로운 닉네임을 입력해주세요.");
				}
			});
		dispatch(editNickname(nickname, state.accessToken)); // 동기화 안됨..
	};

	return (
		<>
			<h2>Change Nickname</h2>
			<div>
				<label>
					<input
						type="text"
						name="change-nickname"
						placeholder="변경할 닉네임을 입력하세요"
						onChange={e => setNickname(e.target.value)}
					/>
				</label>
				<label>
					<input
						type="password"
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
