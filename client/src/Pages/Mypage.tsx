import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from "react-router-dom"; //라우트 추가함
import profile from "../Static/profile-img.png";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import MyPalettes from "../Components/Mypage/MyPalettes";
import Nickname from "../Components/Mypage/Nickname";
import Password from "../Components/Mypage/Password";
import "./Styles/Mypage.css";
import MainTutorial from "../Components/Tutorial/MainTutorial";

import { useSelector } from "react-redux";
import { RootReducerType } from "../Store";

const Mypage = (): JSX.Element => {
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const userImg = userState.user.profileImage;
	console.log("Mypage-userState:", userState);
	const history = useHistory();

	const [openTutorial, setOpenTutorial] = useState<boolean>(false);

	const handleCloseTutorial = () => {
		setOpenTutorial(false);
	};

	const handleShowTutorial = () => {
		setOpenTutorial(true);
	};

	useEffect(() => {
		if (userState.user.id === -1) {
			history.push("/login");
		}
	})

	return (
		<>
			{openTutorial ? <MainTutorial handleCloseTutorial={handleCloseTutorial} /> : ""}
			<Router>
				<Navigation />
				<div className="mypageContainer">
					<div className="leftContents">
						<div className="mypageTitle">MY PAGE</div>
						<div className="userImg">
							{userImg ? <img src={userImg} alt="프로필 사진" /> : <img src={profile} alt="프로필 사진" />}
						</div>
						<div className="userId">{userState.user.email}</div>
						<div className="userId">{userState.user.nickname}</div>
						<div className="sideTap">
							<Link to="/mypage" className="tap">
								닉네임 변경
							</Link>
							<Link to="/mypage/password" className="tap">
								비밀번호 수정
							</Link>
							<Link to="/mypage/mypalettes" className="tap">
								나의 팔레트
							</Link>
							<div className="tap" onClick={handleShowTutorial}>
								가이드 보기
							</div>
						</div>
					</div>
					<div className="rightContents">
						<Switch>
							<Route exact path="/mypage" component={Nickname} />
							<Route path="/mypage/password" component={Password} />
							<Route path="/mypage/mypalettes" component={MyPalettes} />
						</Switch>
					</div>
				</div>
				<Footer />
			</Router>
		</>
	);
};

export default Mypage;
