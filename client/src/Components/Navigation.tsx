import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { logoutUser } from "../actions/index";

const Navigation = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const [isLogin, setIsLogin] = useState(false);

	const logInHandler = () => {
		if (userState.accessToken) setIsLogin(true);
	};

	const logOutHandler = () => {
		if (userState.accessToken) {
			setIsLogin(false);
			dispatch(logoutUser());
		}
	};

	const mypageHandler = () => {
		if (userState.accessToken) history.push("/mypage");
		else history.push("/login");
	};
	useEffect(() => {
		logInHandler();
	}, [isLogin]);

	return (
		<>
			<nav className="navigation">
				<div className="nav-container">
					<div className="left-nav-bar">
						<img className="nav-logo" src="" alt="logo" onClick={() => window.location.replace("/palette")} />
					</div>
					<ul className="right-nav-bar">
						<li>
							<a onClick={mypageHandler}>mypage</a>
						</li>
						{isLogin ? (
							<li>
								<a className="nav-login-btn" onClick={logOutHandler}>
									Logout
								</a>
							</li>
						) : (
							<li>
								<a className="nav-login-btn" onClick={() => window.location.replace("/login")}>
									Login
								</a>
							</li>
						)}
					</ul>
				</div>
			</nav>
		</>
	);
};

export default Navigation;
