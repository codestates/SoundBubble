import React from "react";
import "../Styles/MainMic.css";
import Record from "./Record";

const MainMic = (): JSX.Element => {
	return (
		<>
			<div className="main-page__mic">
				<Record />
			</div>
		</>
	);
};

export default MainMic;
