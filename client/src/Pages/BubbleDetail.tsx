import React, { useState, useEffect } from "react";
import "./Styles/BubbleDetail.css";
// import axios from "axios";
import axiosInstance from '../axios';
import { useHistory } from "react-router-dom";
import backIcon from "./Styles/back.png";
import trashcan from "./Styles/trashcan.png";
// import LoginModal from "../Components/BubbleDetail/LoginModal";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const tokenState = useSelector((state: RootReducerType) => state.tokenReducer);
	const API_URL = process.env.REACT_APP_API_URL;
	const history = useHistory();

	const [commentInput, setCommentInput] = useState("");
	const [bubbleComments, setBubbleComments] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isModal, setIsModal] = useState(false);

	const handleCloseModal = (): any => {
		setIsModal(false);
	};

	const getBubbleId = (): string => {
		return window.location.pathname.split("/")[2];
	};
	const bubbleId = Number(getBubbleId());

	const [bubbleData, setBubbleData] = useState({
		id: "",
		image: "",
		sound: "",
		textContent: "",
		user: { email: "", nickname: "" },
	});

	const getBubbleData = async () => {
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/bubble/${bubbleId}`,
		}).then(res => {
			setBubbleData(res.data.data.bubble);
		});
	};

	const getComment = async () => {
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/bubble/${bubbleId}`,
		}).then(res => {
			setBubbleComments(res.data.data.comments);
			console.log("받아와짐");
		});
	};

	useEffect(() => {
		getComment();
		getBubbleData();
	}, []);

	const handleSubmitComment = async (text: string) => {
		if (!tokenState.accessToken) {
			if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) history.push("/login");
			setIsModal(true);
		}
		await axiosInstance({
			method: "POST",
			url: `${API_URL}/bubble/${bubbleId}/comment`,
			data: { textContent: text },
			headers: {
				authorization: `Bearer ${tokenState.accessToken}`,
			},
		}).then(() => {
			setCommentInput("");
			getComment();
		});
	};

	const handleDeleteComment = async id => {
		await axiosInstance({
			method: "DELETE",
			url: `${API_URL}/bubble/${bubbleId}/comment`,
			data: { commentId: id },
			headers: {
				authorization: `Bearer ${tokenState.accessToken}`,
			},
		}).then(() => {
			getComment();
		});
	};

	const handleDeleteBubble = async () => {
		if (confirm("버블을 삭제하시겠습니까?"))
			await axiosInstance({
				method: "DELETE",
				url: `${API_URL}/bubble/${bubbleId}`,
				headers: {
					authorization: `Bearer ${tokenState.accessToken}`,
				},
			}).then(() => {
				history.push("/palette");
			});
	};

	const audio = new Audio(`${bubbleData.sound}`);

	// todo: 한번 더 클릭하면 소리 멈추게 하기
	// todo: 다른 페이지로 이동하면 소리 멈추게 하기

	const handleStopSound = () => {
		window.location.replace(`/bubble/${bubbleId}`);
		// audio.pause();
		// setIsPlaying(false);
	};
	const handlePlaySound = () => {
		audio.play();
		setIsPlaying(true);
	};

	return (
		<>
			{/* {isModal ? <LoginModal handleCloseModal={handleCloseModal} /> : null} */}
			<div className="bubbleDetail-container">
				<div>
					<img
						src={backIcon}
						className="backIcon"
						alt="뒤로 가기"
						onClick={() => window.location.replace("/palette")}
					/>
					{bubbleData.user.email === state.email ? (
						<img src={trashcan} className="deleteBtn" alt="버블 삭제" onClick={handleDeleteBubble} />
					) : null}
				</div>
				<div className="comment-container">
					{bubbleComments.map((comment: any, i: number) => {
						const commentId = comment.id;
						if (comment.user.email === userState.user.email) {
							return (
								<p
									key={i}
									className="my-comment"
									onDoubleClick={() => {
										if (confirm("댓글을 삭제하시겠습니까?")) handleDeleteComment(commentId);
									}}
								>
									{comment.textContent}
									<span className="comment-user-nickname">삭제하려면 더블클릭하세요.</span>
								</p>
							);
						} else if (Number(comment.id) <= 15) {
							return (
								<p key={i} onDoubleClick={() => alert("본인이 쓴 댓글만 삭제할 수 있습니다.")}>
									{comment.textContent}
									<span className="comment-user-nickname">{comment.user.nickname}</span>
								</p>
							);
						}
					})}
				</div>
				<div className="bubbleDetail-bubble">
					<img
						src={bubbleData.image}
						alt="COLORS OF MY VOICE"
						onClick={isPlaying ? handleStopSound : handlePlaySound}
						className="bubbleImg"
					/>
					<p>{bubbleData.textContent}</p>
				</div>
				<div className="form">
					<label>
						<input
							type="text"
							name="comment"
							placeholder="댓글을 남겨주세요 (댓글 + Enter)"
							onChange={e => setCommentInput(e.target.value)}
							value={commentInput}
							onKeyPress={e => {
								if (e.key === "Enter") {
									handleSubmitComment(commentInput);
								}
							}}
						/>
					</label>
				</div>
				<div className="bubble-user">{bubbleData.user.nickname}님의 Sound Bubble</div>
			</div>
		</>
	);
};

export default BubbleDetail;
