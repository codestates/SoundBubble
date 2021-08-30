import React, { useState } from "react";
import "./Styles/NeedLoginModal.css";

const NeedLoginModal = ({ handleNeedLoginModal }: any): JSX.Element => {
	return (
		<>
			<div className="need-login-background">
				<div className="need-login-box">
					<div className="need-login-top-bar">
						<button className="need-login-close-btn" onClick={handleNeedLoginModal}>
							𝗫
						</button>
					</div>
					<p className="need-login-message">로그인이 필요한 페이지 입니다.</p>
					<p className="need-login-message">로그인 하러 가실?</p>
					<div className="need-login-bottom-bar">
						<button
							className="go-to-login"
							onClick={() => {
								window.location.replace("/login");
							}}
						>
							Login
						</button>
						<button className="go-to-signup" onClick={() => window.location.replace("/signup")}>
							Sign up
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default NeedLoginModal;
