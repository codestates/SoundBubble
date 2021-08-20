import React, { useState, useEffect } from "react";
import "./Styles/BubbleDetail.css";
import axios from "axios";
import Footer from "../Components/Footer";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	const URL = process.env.REACT_APP_API_URL;
	const history = useHistory();

	const [commentInput, setCommentInput] = useState("");
	const [bubbleComments, setBubbleComments] = useState([]);

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
	}, []);

	const handleSubmitComment = async (text: string) => {
		await axios({
			method: "POST",
			url: `${URL}/bubble/${bubbleId}/comment`,
			data: { textContent: commentInput },
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		}).then(res => {
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

	return (
		<>
			<div className="bubbleDetail-container">
				<div className="comment-container">
					{bubbleComments.map((comment: any, i: number) => {
						const commentId = comment.id;
						if (comment.user.email === state.email) {
							return (
								<p key={i} className="my-comment" onDoubleClick={() => handleDeleteComment(commentId)}>
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
					<img src={bubbleData.image} alt="COLORS OF MY VOICE" />
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
				<div className="heart-container">
					{bubbleData.user.nickname} 님의 Sound Bubble
					<div>
						<button className="toBackBtn" onClick={() => history.push("/palette")}>
							뒤로 가기
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default BubbleDetail;
