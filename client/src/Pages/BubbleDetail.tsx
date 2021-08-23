import React, { useState, useEffect, useRef } from "react";
import "./Styles/BubbleDetail.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import backIcon from "./Styles/back.png";
import trashcan from "./Styles/trashcan.png";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	const URL = process.env.REACT_APP_API_URL;
	const history = useHistory();
	console.log(state);

	const [commentInput, setCommentInput] = useState("");
	const [bubbleComments, setBubbleComments] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);

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
		await axios({
			method: "GET",
			url: `${URL}/bubble/${bubbleId}`,
		}).then(res => {
			console.log(res.data.data);
			setBubbleData(res.data.data.bubble);
		});
	};

	const getComment = async () => {
		await axios({
			method: "GET",
			url: `${URL}/bubble/${bubbleId}`,
		}).then(res => {
			setBubbleComments(res.data.data.comments);
		});
	};

	useEffect(() => {
		getComment();
		getBubbleData();
		setIsPlaying(false);
	}, []);

	const handleSubmitComment = async (text: string) => {
		if (!state.accessToken) {
			if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) history.push("/login");
		}
		await axios({
			method: "POST",
			url: `${URL}/bubble/${bubbleId}/comment`,
			data: { textContent: commentInput },
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		}).then(() => {
			setCommentInput("");
			getComment();
		});
	};

	const handleDeleteComment: any = async id => {
		await axios({
			method: "DELETE",
			url: `${URL}/bubble/${bubbleId}/comment`,
			data: { commentId: id },
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		}).then(() => {
			getComment();
			console.log("삭제 완료");
		});
	};

	const handleDeleteBubble: any = async id => {
		if (confirm("버블을 삭제하시겠습니까?"))
			await axios({
				method: "DELETE",
				url: `${URL}/bubble/${bubbleId}`,
				headers: {
					authorization: `Bearer ${state.accessToken}`,
				},
			}).then(() => {
				history.push("/palette");
			});
	};

	const audio = new Audio(`${bubbleData.sound}`);

	const handlePlaySound = () => {
		if (!isPlaying) {
			audio.play();
			setIsPlaying(true);
		} else {
			audio.pause();
			audio.currentTime = 0;
			setIsPlaying(false);
		}
	};
	console.log(isPlaying);

	// 재생 중일때 그림자 효과
	// 페이지 바뀌면 sound off
	// 한번 더 클릭하면 sound off

	return (
		<>
			<div className="bubbleDetail-container">
				<div>
					<img src={backIcon} className="backIcon" alt="뒤로 가기" onClick={() => history.push("/palette")} />
					{bubbleData.user.email === state.email ? (
						<img src={trashcan} className="deleteBtn" alt="버블 삭제" onClick={handleDeleteBubble} />
					) : null}
				</div>
				<div className="comment-container">
					{bubbleComments.map((comment: any, i: number) => {
						const commentId = comment.id;
						if (comment.user.email === state.email) {
							return (
								<p
									key={i}
									className="my-comment"
									onDoubleClick={() => {
										if (confirm("댓글을 삭제하시겠습니까?")) handleDeleteComment(commentId);
									}}
								>
									{comment.textContent}
								</p>
							);
						} else if (Number(comment.id) <= 15) {
							return (
								<p key={i} onDoubleClick={() => alert("본인이 쓴 댓글만 삭제할 수 있습니다.")}>
									{comment.textContent}
								</p>
							);
						}
					})}
				</div>
				<div className="bubble">
					<img src={bubbleData.image} alt="COLORS OF MY VOICE" onClick={handlePlaySound} className="bubbleImg" />
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
				<div className="bubble-user">{bubbleData.user.nickname} 님의 Sound Bubble</div>
			</div>
		</>
	);
};

export default BubbleDetail;
