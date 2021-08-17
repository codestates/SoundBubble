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

	useEffect(() => {
		logInHandler();
	}, [isLogin]);
	return (
		<>
			<nav className="navigation">
				<div className="nav-container">
					<div className="left-nav-bar">
						<img className="nav-logo" src="" alt="logo" onClick={() => history.push("/palette")} />
					</div>
					<ul className="right-nav-bar">
						<li>
							<a onClick={() => history.push("/mypage")}>mypage</a>
						</li>
						{isLogin ? (
							<li>
								<a className="nav-login-btn" onClick={logOutHandler}>
									Logout
								</a>
							</li>
						) : (
							<li>
								<a className="nav-login-btn" onClick={() => history.push("/login")}>
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
