import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { logoutUser } from "../actions/index";
import axios from "axios";

import "./Styles/Navigation.css";

const NavHamburger = (): JSX.Element => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state: RootReducerType) => state.userReducer);

  const logInHandler = () => {
		if (userState.accessToken) setIsLogin(true);
  };
  
  const logOutHandler = async () => {
		if (userState.accessToken) {
			await axios({
				method: "GET",
				url: `${API_URL}/user/logout`,
				headers: {
					authorization: `Bearer ${userState.accessToken}`,
				},
			})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setIsLogin(false);
					dispatch(logoutUser());
					window.location.replace("/");
				});
		}
  };
  useEffect(() => {
		logInHandler();
	}, [isLogin]);
  
  return (
    <ul className="nav-hamburger">
      <li>
        <a onClick={() => window.location.replace("/main")}>Main</a>
      </li>
      <li>
        <a onClick={() => window.location.replace("/palette")}>Palette</a>
      </li>
      <li>
        <a onClick={() => window.location.replace("/mypage")}>Mypage</a>
      </li>
      {(isLogin) ? (
        <li>
          <a onClick={logOutHandler}>Logout {userState.nickname}</a>
      </li>
      ) : (
      <li>
        <a onClick={() => window.location.replace("/login")}>Login</a>
      </li>
      )}
    </ul>
  )
}

export default NavHamburger;