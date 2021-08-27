import React, { useState, useEffect } from "react";
import "./Styles/BubbleDetail.css";
import "./Styles/Reset.css";
import axiosInstance from "../axios";
import { useHistory } from "react-router-dom";
import backIcon from "./Styles/back.png";
import trashcan from "./Styles/trashcan.png";
import Swal from "sweetalert2";

import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../Store";

const BubbleDetail = (): JSX.Element => {
	const dispatch = useDispatch();
	const userState = useSelector((state: RootReducerType) => state.userReducer);
	const API_URL = process.env.REACT_APP_API_URL;
	const history = useHistory();
	console.log(userState);

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
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/bubble/${bubbleId}`,
			// withCredentials: true,
		}).then(res => {
			setBubbleData(res.data.data.bubble);
			setBubbleComments(res.data.data.comments);
		});
	};

	useEffect(() => {
		getBubbleData();
	}, []);

	const handleSubmitComment = async (text: string) => {
		if (userState.user.id >= 0) {
			await axiosInstance({
				method: "POST",
				url: `${API_URL}/bubble/${bubbleId}/comment`,
				data: { textContent: text },
				withCredentials: true,
			}).then(() => {
				setCommentInput("");
				getBubbleData();
			});
		}
	};

	const handleDeleteComment = async id => {
		Swal.fire({
			icon: "warning",
			text: "댓글을 삭제하시겠습니까?",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "삭제하기",
			cancelButtonText: "아니오",
		}).then(result => {
			if (result.isConfirmed) {
				axiosInstance({
					method: "DELETE",
					url: `${API_URL}/bubble/${bubbleId}/comment`,
					data: { commentId: id },
					withCredentials: true,
				}).then(() => {
					getBubbleData();
				});
			}
		});
	};

	const handleDeleteBubble = async () => {
		Swal.fire({
			text: "버블을 삭제하시겠습니까?",
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#f17878",
			confirmButtonColor: "rgb(119, 112, 255)",
			confirmButtonText: "삭제하기",
			cancelButtonText: "아니오",
		}).then(result => {
			if (result.isConfirmed) {
				Swal.fire({
					icon: "success",
					text: "버블이 삭제되었습니다.",
				}).then(() => {
					axiosInstance({
						method: "DELETE",
						url: `${API_URL}/bubble/${bubbleId}`,
						withCredentials: true,
					}).then(() => {
						history.push("/palette");
					});
				});
			}
		});
	};
	const audio = new Audio(`${bubbleData.sound}`);

	const handleStopSound = () => {
		window.location.replace(`/bubble/${bubbleId}`);
	};
	const handlePlaySound = () => {
		audio.play();
		setIsPlaying(true);
	};
	const handleCommentClick = () => {
		if (userState.user.id === -1) {
			Swal.fire({
				text: "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "로그인하기",
				cancelButtonText: "아니오",
			}).then(result => {
				if (result.isConfirmed) {
					window.location.replace("/login");
				}
			});
		}
	};

	return (
		<>
			<div className="bubbleDetail-container">
				<div>
					{isPlaying ? null : (
						<div className="arrow_box">
							{" "}
							Click to <br />
							Play Sound !{" "}
						</div>
					)}
					<img
						src={backIcon}
						className="backIcon"
						alt="뒤로 가기"
						onClick={() => window.location.replace("/palette")}
					/>
					{bubbleData.user.email === userState.user.email ? (
						<img src={trashcan} className="deleteBtn" alt="버블 삭제" onClick={handleDeleteBubble} />
					) : null}
				</div>

				<div className="comment-container">
					{bubbleComments.map((comment: any, i: number) => {
						console.log("댓글 맵함수", comment);
						const commentId = comment.id;
						if (comment.user.email === userState.user.email) {
							return (
								<p key={i} className="my-comment" onDoubleClick={() => handleDeleteComment(commentId)}>
									{comment.textContent}
									<span className="my-nickname">삭제하려면 더블클릭하세요.</span>
								</p>
							);
						} else {
							return (
								<p key={i} onDoubleClick={() => Swal.fire("  ", "본인이 쓴 댓글만 삭제할 수 있습니다.")}>
									{comment.textContent}
									<span className="comment-user-nickname">{comment.user.nickname}</span>
								</p>
							);
						}
					})}
				</div>

				{isPlaying ? (
					<div className="bubbleDetail-bubble isPlaying">
						<img src={bubbleData.image} onClick={handleStopSound} className="bubbleImg" />
						<p>{bubbleData.textContent}</p>
					</div>
				) : (
					<div className="bubbleDetail-bubble">
						<img src={bubbleData.image} onClick={handlePlaySound} className="bubbleImg" />
						<p>{bubbleData.textContent}</p>
					</div>
				)}

				<div className="form">
					<label>
						<input
							type="text"
							name="comment"
							placeholder={
								userState.user.id === -1 ? "댓글을 남기시려면 로그인이 필요합니다" : "댓글을 남겨주세요 (댓글 + Enter)"
							}
							onChange={e => setCommentInput(e.target.value)}
							value={commentInput}
							// disabled={userState.user.id === -1 ? true : false}
							readOnly={userState.user.id === -1 ? true : false}
							onKeyPress={e => {
								if (e.key === "Enter") {
									handleSubmitComment(commentInput);
								}
							}}
							onClick={handleCommentClick}
						/>
					</label>
				</div>
				<div className="bubble-user">
					<p>{bubbleData.user.nickname}님의 Sound Bubble</p>
				</div>
			</div>
		</>
	);
};

export default BubbleDetail;
