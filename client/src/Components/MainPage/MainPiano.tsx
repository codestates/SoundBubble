import React from "react";
import "../Styles/MainPiano.css";
import Piano from "../../Components/Piano/Piano";

const MainPiano = (): JSX.Element => {
	return (
		<>
			<div className="main-page__piano">
				<h1>piano-page</h1>
				<Piano />
			</div>
		</>
	);
};

export default MainPiano;
