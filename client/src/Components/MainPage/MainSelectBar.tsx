import React, { useState } from "react";

import piano from "../../Static/icons/piano.png";
import mic from "../../Static/icons/mic.png";
import upload from "../../Static/icons/upload.png";

import "../Styles/MainSelector.css";

interface SelectProps {
	select: string;
	handleBtnClick: (e: any) => void;
}

const MainSelectBar = (props: SelectProps): JSX.Element => {
	const { select, handleBtnClick } = props;
	return (
		<>
			<div className="select-mode">
				{select === "piano" ? (
					<img className="piano" src={piano} onClick={e => handleBtnClick(e)} style={{ transform: "scale(1.3)" }} />
				) : (
					<img className="piano" src={piano} onClick={e => handleBtnClick(e)} />
				)}
				{select === "mic" ? (
					<img className="mic" src={mic} onClick={e => handleBtnClick(e)} style={{ transform: "scale(1.3)" }} />
				) : (
					<img className="mic" src={mic} onClick={e => handleBtnClick(e)} />
				)}
				{select === "upload" ? (
					<img className="upload" src={upload} onClick={e => handleBtnClick(e)} style={{ transform: "scale(1.3)" }} />
				) : (
					<img className="upload" src={upload} onClick={e => handleBtnClick(e)} />
				)}
			</div>
		</>
	);
};

export default MainSelectBar;
