import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootReducerType } from "../../Store";
import moment from "moment";

const MyPalettes = (): JSX.Element => {
	const history = useHistory();
	const dispatch = useDispatch();
	const state = useSelector((state: RootReducerType) => state.userReducer);
	console.log(state);

	// todo: 배열 형태로 받아온 버블들을 map 함수를 이용해 나타내기
	const [myBubbles, setMyBubbles] = useState([]);

	const url = process.env.REACT_APP_API_URL;

	// 버블 받아오기
	const getMyBubbles = async () => {
		await axios({
			method: "GET",
			url: `${url}/user/mypage/bubble`,
			headers: {
				authorization: `Bearer ${state.accessToken}`,
			},
		}).then(res => {
			setMyBubbles(res.data.data.bubbles);
		});
	};

	useEffect(() => {
		getMyBubbles();
	}, []);

	return (
		<>
			<div className="palette-container">
				{myBubbles.map((bubble: any, i: number) => {
					console.log(bubble);
					const bubbleId = bubble.id;
					const date = bubble.createdAt;
					const subDate = date.substr(0, 10);
					const result = moment(subDate, "YYYY-MM-DD").add(5, "days").format("YYYY.MM.DD");
					return (
						<div className="palette-wrap" key={i}>
							<div className="palette" onClick={() => window.location.replace(`/bubble/${bubbleId}`)}>
								{result}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default MyPalettes;
