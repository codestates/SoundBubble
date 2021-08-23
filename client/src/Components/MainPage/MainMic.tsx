import React from "react";
import "../Styles/MainMic.css";
import RecordCanvas from "./RecordCanvas";
const MainMic = ({ backColor, pickSpeed }: any): JSX.Element => {
	return (
		<>
			<div className="main-page__mic">
				<RecordCanvas backColor={backColor} pickSpeed={pickSpeed} />
			</div>
		</>
	);
};

export default MainMic;
