import React from "react";
import "./Modal.css";

interface Props {
	handleCloseModal: () => void;
}

const LoginModal = ({ handleCloseModal }: Props): JSX.Element => {
	return (
		<>
			<div className="modal-background">
				<main className="modal-box">
					<div className="modal-top-bar">
						<div className="btn-box">
							<button className="close-btn" onClick={handleCloseModal}>
								𝗫
							</button>
						</div>
					</div>
					<div className="modal-content">로그인이 필요합니다.</div>
					<button className="detail-loginBtn">로그인</button>
				</main>
			</div>
		</>
	);
};

export default LoginModal;
