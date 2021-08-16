import React from "react";
import { useHistory } from "react-router-dom";
import TempBubbleImg from "../../Static/gradient.png";
import "./Bubble.css";

const Bubble = ({ bubble }: any): JSX.Element => {
	const {
		id,
		image,
		textContent,
		user: { nickname },
	} = bubble;
	const history = useHistory();
	const randomConst = 12;
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();
	// ! bubble.image로 대체예정
	const BubbleImg = "https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350";

	return (
		<>
			<div className="bubble-section">
				<div
					className="bubble"
					style={{
						left: `${getRandom(-10, 30)}%`,
						top: `${getRandom(5, 45)}%`,
						backgroundImage: `url(${TempBubbleImg})`,
					}}
					onClick={() => history.push(`/bubble/${id}`)}
				>
					{textContent}
				</div>
			</div>
		</>
	);
};

export default Bubble;
