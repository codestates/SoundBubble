import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/BubbleDetail.css";
import pastel from "../Static/pastel.png";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";
import { cpuUsage } from "process";

const BubbleDetail = ({ userInfo }): JSX.Element => {
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	const history = useHistory();
	const URL = process.env.REACT_APP_API_URL;

	const [commentInput, setCommentInput] = useState("");
	// const [count, setCount] = useState(0); // 좋아요 카운트

	const getBubbleId = (): string => {
		return window.location.pathname.split("/")[2];
	};
	const bubbleId = Number(getBubbleId());

	// ? # 해당 버블 id 의 data 불러오기
	const [bubbleData, setBubbleData] = useState({});
	const [bubbleComments, setBubbleComments] = useState([]);

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
	}, []);

	// ? # 댓글 입력
	const handleSubmitComment = async (text: string) => {
		await axios({
			method: "POST",
			url: `${URL}/bubble/${bubbleId}/comment`,
			data: { textContent: commentInput },
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		}).then(res => {
			getComment();
		});
	};

	// ? # 댓글 더블 클릭시 삭제
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
							return <p key={i}>{comment.textContent}</p>;
						}
					})}
				</div>
				<div className="bubble">
					<img src={pastel} alt="COLORS OF MY VOICE" />
					<p>COLORS OF MY VOICE</p>
				</div>
				<div className="form">
					<label>
						<input
							type="text"
							name="comment"
							placeholder="댓글을 남겨주세요"
							onChange={e => setCommentInput(e.target.value)}
							onKeyPress={e => {
								if (e.key === "Enter") {
									handleSubmitComment(commentInput);
								}
							}}
						/>
					</label>
				</div>
				<div className="heart-container">
					<i className="fas fa-heart"></i>
					{/* <p className="count">13</p> */}
				</div>
			</div>
		</>
	);
};

export default BubbleDetail;
