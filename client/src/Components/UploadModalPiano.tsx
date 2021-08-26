import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/UploadModal.css";
import INSTA from "../Static/icons/insta_share.png";
import KAKAO from "../Static/icons/kakao_share.png";
import FACEBOOK from "../Static/icons/facebook_share.png";
import SHARE from "../Static/icons/share_icon.png";
// import axios from "axios";
import axiosInstance from "../axios";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { BubbleData } from "../@type/request";
import styled from "styled-components";

import UploadLimitModal from "./UploadLimitModal";

interface Props {
	handleCloseModal: () => void;
	handleSaveClick: () => void;
	viewImage: string;
	bubbleData: BubbleData;
}

const UploadModalPiano = ({ handleCloseModal, handleSaveClick, viewImage, bubbleData }: Props): JSX.Element => {
	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;
	const [textContent, setTextContent] = useState<string>("텍스트를 입력해주세요!");
	const tokenState = useSelector((state: RootReducerType) => state.tokenReducer);
	const { accessToken } = tokenState;
	const dispatch = useDispatch();

	const handleBubbleUpload = (): void => {
		setIsLimitModal(true);

		const formData = new FormData();
		// formData.append("image", viewImage);
		formData.append("image", bubbleData.image as File);
		formData.append("sound", bubbleData.sound as File);
		formData.append("textContent", textContent);

		axiosInstance({
			method: "POST",
			url: `${API_URL}/bubble/upload`,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				authorization: `Bearer ${accessToken}`,
			},
			withCredentials: true,
		})
			.then(resp => {
				history.push("/palette");
			})
			.catch(err => {
				console.log("업로드 에러");
			});
	};

	const [isLimitModal, setIsLimitModal] = useState<boolean>(false);
	const handleLimitModal = () => {
		setIsLimitModal(false);
	};

	return (
		<>
			{isLimitModal ? <UploadLimitModal handleLimitModal={handleLimitModal} /> : null}
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
							{/* <img className="share_icon INSTA_icon" src={INSTA} alt="INSTA" />
							<img className="share_icon KAKAO_icon" src={KAKAO} alt="KAKAO" />
							<img className="share_icon FACEBOOK_icon" src={FACEBOOK} alt="FACEBOOK" />
							<img className="share_icon SHARE_icon" src={SHARE} alt="SHARE" /> */}
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default UploadModalPiano;
