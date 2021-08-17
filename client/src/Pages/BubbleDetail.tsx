import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Styles/BubbleDetail.css";
import pastel from "../Static/pastel.png";
import axios from "axios";
import { useLocation } from "react-router";

const BubbleDetail = ({ userInfo }): JSX.Element => {
	const [comment, setComment] = useState("");
	const [count, setCount] = useState(0);
	const location = useLocation();

	const history = useHistory();
	const accessToken = localStorage.getItem("accessToken");
	const URL = process.env.REACT_APP_API_URL;

	let bubbleId: string;
	const getBubbleId = (): string => {
		return window.location.pathname.split("/")[2];
		bubbleId = getBubbleId();
	};
	// ? # 댓글 받아와서 보여주기
	return (
		<>
			<div className="bubbleDetail-container">
				<div className="comment-container">
					<p>댓글임댓글임</p>
					<p className="my-comment">댓글임댓글임</p>
					<p>댓글임댓글임</p>
					<p>댓글임댓글임</p>
					<p>댓글임댓글임</p>
				</div>
				<div className="bubble">
					<img src={pastel} alt="COLORS OF MY VOICE" />
					<p>COLORS OF MY VOICE</p>
				</div>
				<form method="POST" action={URL}>
					<label>
						<input
							type="text"
							name="comment"
							placeholder="댓글을 남겨주세요"
							onChange={e => setComment(e.target.value)}
						/>
					</label>
				</form>
				<div className="heart-container">
					<i className="fas fa-heart"></i>
					<p className="count">13</p>
				</div>
			</div>
		</>
	);
};

export default BubbleDetail;
