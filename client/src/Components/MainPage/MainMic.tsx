import React from "react";
import "../Styles/MainMic.css";
import RecordCanvas from "./RecordCanvas";
const MainMic = (): JSX.Element => {
	return (
		<>
			<div className="main-page__mic">
				<RecordCanvas />
			</div>
		</>
	);
};

export default MainMic;
