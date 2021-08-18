import React from "react";
import "./Styles/UploadModal.css";
import TempBubbleImg from "../Static/gradient.png";
import INSTA from "../Static/icons/insta_share.png";
import KAKAO from "../Static/icons/kakao_share.png";
import FACEBOOK from "../Static/icons/facebook_share.png";
import SHARE from "../Static/icons/share_icon.png";

interface BubbleData {
	image: string;
	sound: string;
	textContent: string;
}

interface Props {
	handleCloseModal: () => void;
	bubbleData: BubbleData;
}

const handleBubbleUpload = (): void => {
	console.log("upload!");
};

const UploadModal = ({ handleCloseModal, bubbleData }: Props): JSX.Element => {
	console.log(bubbleData);
	return (
		<>
			<div className="upload-modal-background">
				<main className="upload-modal-box">
					<div className="upload-modal-top-bar">
						<div className="upload-modal-btn-box">
							<button className="upload-modal-close-btn" onClick={handleCloseModal}>
								𝗫
							</button>
						</div>
					</div>
					<div className="upload-modal-image-content">
						<img className="upload-modal-image" src={TempBubbleImg} />
					</div>
					<div className="create-message">이미지 생성이 완료되었습니다!</div>
					<div className="upload-modal-option-content">
						<div className="upload-btn-box">
							<button className="bubble-upload-btn" onClick={handleBubbleUpload}>
								버블 업로드
							</button>
							<button className="bubble-download-btn">버블 다운로드</button>
						</div>
						<div className="social-share-btn-box">
							<img className="share_icon INSTA_icon" src={INSTA} alt="INSTA" />
							<img className="share_icon KAKAO_icon" src={KAKAO} alt="KAKAO" />
							<img className="share_icon FACEBOOK_icon" src={FACEBOOK} alt="FACEBOOK" />
							<img className="share_icon SHARE_icon" src={SHARE} alt="SHARE" />
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default UploadModal;
