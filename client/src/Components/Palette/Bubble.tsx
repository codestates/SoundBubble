import React from "react";
import "./Bubble.css";

const Bubble = ({ bubble }: any): JSX.Element => {
	const {
		id,
		image,
		textContent,
		user: { nickname },
	} = bubble;
	const randomConst = 35;
	const randomNum = Math.floor(Math.random() * randomConst).toString();
	return (
		<>
			<div className="bubble-section">
				<div
					className="bubble"
					style={{
						left: `${randomNum}%`,
						right: `${randomNum}%`,
						bottom: `${randomNum}%`,
						top: `${randomNum}%`,
					}}
				>
					ID:{id} <br />
					{image} <br />
					text:{textContent} <br />
					nickname:{nickname}
				</div>
			</div>
		</>
	);
};

export default Bubble;
