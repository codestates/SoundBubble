import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { removeUserInfo } from "../actions";
import axios from "axios";
import Swal from "sweetalert2";

const Navigation = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const [isLogin, setIsLogin] = useState(false);
	const [open, setOpen] = useState(true);
	const API_URL = process.env.REACT_APP_API_URL;

	const logInHandler = () => {
		if (userState.user.id >= 0) setIsLogin(true);
	};

	const logOutHandler = async () => {
		if (userState.user.id >= 0) {
			await axios({
				method: "GET",
				url: `${API_URL}/user/logout`,
				withCredentials: true,
			})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setIsLogin(false);
					dispatch(removeUserInfo());
					window.location.replace("/");
				});
		}
	};

	const openChange = () => {
		setOpen(!open);
	};

	const mypageHandler = () => {
		if (userState.user.id >= 0) history.push("/mypage");
		else {
			Swal.fire({
				text: "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "로그인하기",
				cancelButtonText: "아니오",
			}).then(result => {
				if (result.isConfirmed) {
					window.location.replace("/login");
				}
			});
		}
	};
	
	useEffect(() => {
		logInHandler();
	}, [isLogin]);

	useEffect(() => {
		openChange();
	}, []);

	return (
		<>
			<nav className="navigation">
				<div className="nav-container">
					<div className="left-nav-bar">
						<img className="nav-logo" src="logo_w.png" alt="logo" onClick={() => window.location.replace("/")} />
					</div>
					<ul className="right-nav-bar">
						<li>
							<a onClick={() => window.location.replace("/main")}>Main</a>
						</li>
						<li>
							<a onClick={() => window.location.replace("/palette")}>Palette</a>
						</li>
						<li>
							<a onClick={mypageHandler}>Mypage</a>
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
					{open ? (
						<div className="nav-hamburger">
							<button className="nav-close-btn" onClick={openChange}></button>
							<ul className="nav-hamburger-bar">
								<li>
									<a onClick={() => window.location.replace("/main")}>Main</a>
								</li>
								<li>
									<a onClick={() => window.location.replace("/palette")}>Palette</a>
								</li>
								<li>
									<a onClick={mypageHandler}>Mypage</a>
								</li>
								<li>
									<hr className="nav-hr"></hr>
								</li>
								{isLogin ? (
									<>
										<li>
											<a>
												<img
													className="nav-user-img"
													src={userState.user.profileImage === null ? "" : userState.user.profileImage}
												></img>
												{userState.user.nickname}
											</a>
										</li>
										<li>
											<a className="nav-login-btn" onClick={logOutHandler}>
												Logout
											</a>
										</li>
									</>
								) : (
									<li>
										<a className="nav-login-btn" onClick={() => window.location.replace("/login")}>
											Login
										</a>
									</li>
								)}
							</ul>
						</div>
					) : (
						<button className="nav-hamburger-btn" onClick={openChange}></button>
					)}
				</div>
			</nav>
		</>
	);
};

export default Navigation;
