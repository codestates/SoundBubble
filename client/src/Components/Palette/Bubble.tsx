import React from "react";
import { useHistory } from "react-router-dom";
import "./Bubble.css";

const Bubble = ({ bubble }: any): JSX.Element => {
	const { id, image, textContent } = bubble;
	const history = useHistory();
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();

	return (
		<>
			<div className="bubble-section">
				<div
					className="bubble"
					style={{
						left: `${getRandom(-40, 40)}%`,
						top: `${getRandom(5, 70)}%`,
						backgroundImage: `url(${bubble.image})`,
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
