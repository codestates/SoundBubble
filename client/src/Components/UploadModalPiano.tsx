import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/UploadModal.css";
import INSTA from "../Static/icons/insta_share.png";
import KAKAO from "../Static/icons/kakao_share.png";
import FACEBOOK from "../Static/icons/facebook_share.png";
import SHARE from "../Static/icons/share_icon.png";
// import axios from "axios";
import { BubbleData } from "../@type/request";
import styled from "styled-components";
import Swal from "sweetalert2";
import UploadLimitModal from "./UploadLimitModal";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

interface Props {
	handleCloseModal: () => void;
	handleSaveClick: () => void;
	viewImage: string;
	bubbleData: BubbleData;
}

const UploadModalPiano = ({ handleCloseModal, handleSaveClick, viewImage, bubbleData }: Props): JSX.Element => {
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const handleBubbleUpload = (): void => {
		Swal.fire({
			title: "",
			text: "조금만 기다려주세요.",
		});
	};

	const [isLimitModal, setIsLimitModal] = useState<boolean>(false);
	const handleLimitModal = () => {
		setIsLimitModal(false);
	};

	const kakaoShare = (): void => {
		// ? # base64 -> file 형태로 만들기
		function dataURLtoFile(dataurl, filename) {
			const arr = dataurl.split(",");
			const mime = arr[0].match(/:(.*?);/)[1];
			const bstr = atob(arr[1]);
			let n = bstr.length;
			const u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, { type: mime });
		}
		const file = dataURLtoFile(viewImage, "mybubble.png");

		// ? # 카카오톡 서버에 image 임시 업로드하기
		window.Kakao.Link.uploadImage({
			file: [file], // 배열로 감싸주기
		}).then(function (res) {
			// console.log("###", res.infos.original.url);
			const imageUrl = res.infos.original.url;

			// ? # 카카오톡 url 공유하기
			window.Kakao.Link.createDefaultButton({
				container: ".KAKAO_icon",
				objectType: "feed",
				content: {
					title: `${
						userState.user.nickname === "" ? "Guest" : userState.user.nickname
					}님의 멋진 피아노 연주 색깔이에요!`,
					description: "Sound Bubble이 뭔지 궁금하다면?",
					imageUrl: imageUrl,
					link: {
						mobileWebUrl: "https://www.soundbubble.io",
						webUrl: "https://www.soundbubble.io",
					},
				},
				buttons: [
					{
						title: "버블 구경하기",
						link: {
							mobileWebUrl: "https://www.soundbubble.io/palette",
							webUrl: "https://www.soundbubble.io/palette",
						},
					},
					{
						title: "지금 만들러가기",
						link: {
							mobileWebUrl: "https://www.soundbubble.io/main",
							webUrl: "https://www.soundbubble.io/main",
						},
					},
				],
			});
		});
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
						<img className="modal-noise" src="noise.png" />
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
							<img className="share_icon KAKAO_icon" src={KAKAO} alt="KAKAO" onClick={kakaoShare} />
							<img className="share_icon FACEBOOK_icon" src={FACEBOOK} alt="FACEBOOK" />
							<img className="share_icon SHARE_icon" src={SHARE} alt="SHARE" />
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default UploadModalPiano;
