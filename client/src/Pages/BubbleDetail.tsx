import React from "react";
import "./Styles/BubbleDetail.css";
import pastel from "../Static/pastel.png";

const BubbleDetail = (): JSX.Element => {
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
				<form method="POST" action="">
					<label>
						<input type="text" name="comment" placeholder="댓글을 남겨주세요" />
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
