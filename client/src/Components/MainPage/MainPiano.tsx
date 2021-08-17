import React from "react";
import "../Styles/MainPiano.css";
import Piano from "../../Components/Piano/Piano";
import Record from "./Record";

const MainPiano = (): JSX.Element => {
	const handleClick = () => {
		console.log("버튼 클릭");
	};
	return (
		<>
			<div className="main-page__piano">
				<h1>piano-page</h1>
				<Record />
				<Piano handleClick={handleClick} />
			</div>
		</>
	);
};

export default MainPiano;
