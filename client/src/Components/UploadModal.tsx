import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/UploadModal.css";
import INSTA from "../Static/icons/insta_share.png";
import KAKAO from "../Static/icons/kakao_share.png";
import FACEBOOK from "../Static/icons/facebook_share.png";
import SHARE from "../Static/icons/share_icon.png";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootReducerType } from "../Store";

interface Props {
	handleCloseModal: () => void;
	handleSaveClick: () => void;
	viewImage: string;
}

const UploadModal = ({ handleCloseModal, handleSaveClick, viewImage }: Props): JSX.Element => {
	const history = useHistory();
	const BUBBLE_URL = process.env.REACT_APP_API_URL;
	const [textContent, setTextContent] = useState<string>("텍스트를 입력해주세요!");
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const { accessToken } = userState;

	const handleBubbleUpload = (): void => {
		const formData = new FormData();
		formData.append("image", viewImage);
		// formData.append("sound", DummyData.sound);
		formData.append("textContent", textContent);

		// ! # 현재 업로드 기능이 제대로 구현되지 않음.
		// ! # 현재 업로드 기능이 제대로 구현되지 않음.
		// ! # 현재 업로드 기능이 제대로 구현되지 않음.
		// axios({
		// 	method: "POST",
		// 	url: `${BUBBLE_URL}/bubble/upload`,
		// 	data: formData,
		// 	headers: {
		// 		"Content-Type": "multipart/form-data",
		// 		authorization: `Bearer ${accessToken}`,
		// 	},
		// })
		// 	.then(resp => {
		// 		console.log("###", resp);
		// 		// history.push("/palette");
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});
	};

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
						<img className="upload-modal-image" src={viewImage} />
						<input
							className="bubble-textContent"
							onChange={e => setTextContent(e.target.value)}
							placeholder="텍스트를 입력해 주세요!"
						/>
					</div>
					<div className="create-message">이미지 생성이 완료되었습니다!</div>
					<div className="upload-modal-option-content">
						<div className="upload-btn-box">
							<button className="bubble-upload-btn" onClick={handleBubbleUpload}>
								버블 업로드
							</button>
							<button className="bubble-download-btn" onClick={handleSaveClick}>
								버블 다운로드
							</button>
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
