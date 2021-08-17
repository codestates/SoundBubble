import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Bubble from "./Bubble";
import axios from "axios";
interface User {
	email: string;
	nickname: string;
}
interface Bubble {
	id: number;
	image: string;
	thumbnail: string;
	sound: string;
	textContent: string;
	createdAt: string;
	user: User;
}

// ? ###### Palette Column 구조 ######
const Palette = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	background-color: rgba(2, 7, 21, 0.9);
`;

const Column = styled.div`
	width: 34%;
`;

const PalettePart = (): JSX.Element => {
	// ? # bubble 배열을 받아왔을 때, column으로 배치하기
	const [bubbles, setBubble] = useState([]);

	// ? ###### 서버에서 Bubble 가져오기 ######
	const getBubble = () => {
		axios({ method: "GET", url: `${process.env.REACT_APP_API_URL}/bubble`, withCredentials: true }).then(resp => {
			const { bubbles } = resp.data.data;
			setBubble(bubbles);
		});
	};

	useEffect(() => {
		getBubble();
	}, []);

	// ? ###### 지정한 Column에 Bubble 뿌려주기 ######
	// ? # Bubble Array 지정
	const bubbleArr1: Bubble[] = [];
	const bubbleArr2: Bubble[] = [];
	const bubbleArr3: Bubble[] = [];
	// const bubbleArr4: Bubble[] = [];

	// ? # 지정한 Bubble Array에 서버에서 가져온 Bubble들을 넣어주기
	bubbles.forEach((bubble: Bubble, idx: number) => {
		const index = idx % 3;
		if (index === 0) bubbleArr1.push(bubble);
		else if (index === 1) bubbleArr2.push(bubble);
		else if (index === 2) bubbleArr3.push(bubble);
		// else if (index === 3) bubbleArr4.push(bubble);
	});

	return (
		<>
			<Palette>
				<Column>
					{bubbleArr1.map((bubble: Bubble, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				<Column>
					{bubbleArr2.map((bubble: Bubble, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				<Column>
					{bubbleArr3.map((bubble: Bubble, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				{/* <Column>
					{bubbleArr4.map((bubble: Bubble, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column> */}
			</Palette>
		</>
	);
};

export default PalettePart;
