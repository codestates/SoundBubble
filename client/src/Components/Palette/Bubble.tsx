import React from "react";
import { useHistory } from "react-router-dom";
import "./Bubble.css";

const Bubble = ({ bubble, location, topBubble, endBubble }: any): JSX.Element => {
	const { id, image, textContent } = bubble;
	const history = useHistory();
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();

	const handlePositionX = location => {
		if (location === "L") return getRandom(0, 40);
		else if (location === "M") return getRandom(-40, 40);
		else if (location === "R") return getRandom(-20, 40);
	};

	const handlePositionY = location => {
		if (topBubble.includes(id)) return getRandom(0, 40);
		else if (endBubble.includes(id)) return getRandom(-35, 30);
		else return getRandom(-20, 20);
	};

	return (
		<>
			<div className="bubble-section">
				<div
					className="bubble"
					style={{
						left: `${handlePositionX(location)}%`,
						top: `${handlePositionY(location)}%`,
						backgroundImage: `url(${bubble.image})`,
						transition: "2.85s",
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
