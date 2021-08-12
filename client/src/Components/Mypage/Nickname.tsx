import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Nickname = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const URL = process.env.REACT_APP_API_URL;

  const handleChangeNickname = () => {
  };

  return (
    <>
      <h2>Change Nickname</h2>
      <form action="" method="POST">
        <label>
          <input type="text" name="change-nickname" placeholder="닉네임을 입력하세요"/>
        </label>
        <label>
          <input type="text" name="password" placeholder="비밀번호를 입력하세요"/>
        </label>
        <button onClick={handleChangeNickname}>닉네임 변경</button>
      </form>
    </>
  )
};

export default Nickname;
