import React from "react";
import "../Styles/MainMic.css";
import Record from "./Record";

import { useSelector } from "react-redux";
import { RootReducerType } from "../../Store";

const MainMic = (): JSX.Element => {
	const state = useSelector((state: RootReducerType) => state.userReducer);
	console.log("###", state);
	return (
		<>
			<div className="main-page__mic">
				<Record />
			</div>
		</>
	);
};

export default MainMic;
