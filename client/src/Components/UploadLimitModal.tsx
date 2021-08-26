import React, { useState } from "react";
import "./Styles/UploadLimitModal.css";

const UploadLimitModal = ({ handleLimitModal }: any): JSX.Element => {
	return (
		<>
			<div className="need-login-background">
				<div className="need-login-box">
					<div className="need-login-top-bar">
						<button className="need-login-close-btn" onClick={handleLimitModal}>
							𝗫
						</button>
					</div>
					<p className="need-login-message">피아노 사운드 업로드 기능은 준비중입니다.</p>
					<p className="need-login-message">조금만 기다려주세요!</p>
					<div className="need-login-bottom-bar"></div>
				</div>
			</div>
		</>
	);
};

export default UploadLimitModal;
