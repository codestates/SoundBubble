import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import emptyBubble from "../../Static/emptyBubble.png";

const MyPalettes = (): JSX.Element => {
	// todo: 배열 형태로 받아온 버블들을 map 함수를 이용해 나타내기
	const [myBubbles, setMyBubbles] = useState([]);
	const API_URL = process.env.REACT_APP_API_URL;

	// 버블 받아오기
	const getMyBubbles = async () => {
		await axiosInstance({
			method: "GET",
			url: `${API_URL}/user/mypage/bubble`,
			withCredentials: true,
		}).then(res => {
			setMyBubbles(res.data.data.bubbles);
		});
	};

	useEffect(() => {
		getMyBubbles();
	}, []);

	return (
		<>
			{myBubbles.length === 0 ? (
				<div className="mypalettes_container">
					<img src={emptyBubble} className="emptyBubble" />
					<div className="mypalettes_mainBtn">
						<button onClick={() => window.location.replace("/main")}>버블 만들기</button>
					</div>
				</div>
			) : (
				<div className="palette-container">
					{myBubbles.map((bubble: any, i: number) => {
						const bubbleId = bubble.id;
						return (
							<div className="palette-wrap" key={i}>
								<img
									src={bubble.image}
									alt="bubble"
									className="palette"
									onClick={() => window.location.replace(`/bubble/${bubbleId}`)}
								/>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};

export default MyPalettes;
