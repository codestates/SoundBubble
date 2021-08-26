import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/UploadModal.css";
import INSTA from "../Static/icons/insta_share.png";
import KAKAO from "../Static/icons/kakao_share.png";
import FACEBOOK from "../Static/icons/facebook_share.png";
import SHARE from "../Static/icons/share_icon.png";
import axiosInstance from "../axios";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { BubbleData } from "../@type/request";

import NeedLoginModal from "./UploadLimitModal";

interface Props {
	handleCloseModal: () => void;
	handleSaveClick: () => void;
	viewImage: string;
	bubbleData: BubbleData;
}

const UploadModal = ({ handleCloseModal, handleSaveClick, viewImage, bubbleData }: Props): JSX.Element => {
	const history = useHistory();
	const API_URL = process.env.REACT_APP_API_URL;
	const [textContent, setTextContent] = useState<string>("");
	const userState = useSelector((state: RootReducerType) => state.userReducer);

	const dispatch = useDispatch();

	const [bubbleUrl, setBubbleUrl] = useState<string>(viewImage);

	const handleBubbleUpload = (): void => {
		console.log("업로드 bubbleData", bubbleData);

		if (userState.user.id === -1) {
			setNeedLogin(true);
			return;
		}

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

	const [needLogin, setNeedLogin] = useState<boolean>(false);
	const handleNeedLoginModal = () => {
		setNeedLogin(false);
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
			setBubbleUrl(imageUrl);

			// ? # 카카오톡 url 공유하기
			window.Kakao.Link.createDefaultButton({
				container: ".KAKAO_icon",
				objectType: "feed",
				content: {
					title: `${userState.user.nickname === "" ? "Guest" : userState.user.nickname}님의 멋진 목소리 색깔이에요!`,
					description:
						textContent === ""
							? "Sound Bubble이 뭔지 궁금하다면?"
							: `${userState.user.nickname === "" ? "Guest" : userState.user.nickname} : ${textContent}`,
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
			{needLogin ? <NeedLoginModal handleNeedLoginModal={handleNeedLoginModal} /> : null}
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

export default UploadModal;
