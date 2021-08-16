import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"; //라우트 추가함
import profile from "../Static/profile-img.png";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import { useHistory } from "react-router-dom";
import MyPalettes from "../Components/Mypage/MyPalettes";
import Nickname from "../Components/Mypage/Nickname";
import Password from "../Components/Mypage/Password";
import "./Styles/Mypage.css";

const Mypage = (): JSX.Element => {
	return (
		<>
			<Router>
				{/* <Navigation /> */}
				<div className="mypageContainer">
					<div className="leftContents">
						<div className="mypageTitle">MY PAGE</div>
						<div className="userImg">
							<img src={profile} alt="프로필 사진" />
						</div>
						<div className="userId">유저 아이디</div>
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
