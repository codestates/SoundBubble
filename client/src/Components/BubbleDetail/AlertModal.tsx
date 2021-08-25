import React from "react";
import "./Modal.css";

interface Props {
	handleCloseModal: () => void;
}

const AlertModal = ({ handleCloseModal }: Props): JSX.Element => {
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
					<div className="modal-content"></div>
				</main>
			</div>
		</>
	);
};

export default AlertModal;
