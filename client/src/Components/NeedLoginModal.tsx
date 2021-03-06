import React, { useState } from "react";
import "./Styles/NeedLoginModal.css";

const NeedLoginModal = ({ handleNeedLoginModal }: any): JSX.Element => {
	return (
		<>
			<div className="need-login-background">
				<div className="need-login-box">
					<div className="need-login-top-bar">
						<button className="need-login-close-btn" onClick={handleNeedLoginModal}>
							π«
						</button>
					</div>
					<p className="need-login-message">λ‘κ·ΈμΈμ΄ νμν νμ΄μ§ μλλ€.</p>
					<p className="need-login-message">λ‘κ·ΈμΈ νλ¬ κ°μ€?</p>
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
