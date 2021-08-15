import React from "react";
import styled from "styled-components";
import Bubble from "./Bubble";
import axios from "axios";
import { dummyBubble } from "./dummyBubble";

// interface Bubble {
// 	id: string;
// 	image: string;
// 	thumbnail: string;
// 	sound: string;
// 	textContent: string;
// 	createdAt: string;
// }

const Palette = styled.div`
	display: flex;
`;

const Column = styled.div`
	width: 25%;
	height: 200vh;
	/* border: 10px solid black; */
`;

const PalettePart = (): JSX.Element => {
	// ? # bubble 배열을 받아왔을 때, column으로 배치하기
	// axios({ method: "GET", url: process.env.REACT_APP_API_URL, withCredentials: true }).then(resp => console.log(resp));
	const { bubbles } = dummyBubble;
	console.log(bubbles);
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	// TODO : any type 재지정하기!!!!!!!
	const bubbleArr1: any = [];
	const bubbleArr2: any = [];
	const bubbleArr3: any = [];
	const bubbleArr4: any = [];

	bubbles.forEach((bubble: any, idx: number) => {
		const index = idx % 4;
		if (index === 0) bubbleArr1.push(bubble);
		else if (index === 1) bubbleArr2.push(bubble);
		else if (index === 2) bubbleArr3.push(bubble);
		else if (index === 3) bubbleArr4.push(bubble);
	});
	return (
		<>
			<Palette>
				<Column>
					{bubbleArr1.map((bubble: any, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				<Column>
					{bubbleArr2.map((bubble: any, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				<Column>
					{bubbleArr3.map((bubble: any, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
				<Column>
					{bubbleArr4.map((bubble: any, i: number) => (
						<Bubble key={i} bubble={bubble} />
					))}
				</Column>
			</Palette>
		</>
	);
};

export default PalettePart;
