import React, { useState } from "react";
import MainPiano from "../Components/MainPage/MainPiano";
import MainMic from "../Components/MainPage/MainMic";
import MainUpload from "../Components/MainPage/MainUpload";
import Error404 from "../Pages/error404";
import Navigation from "../Components/Navigation";
import Footer from "../Components/Footer";

import "./Styles/MainPage.css";
import MainSelectBar from "../Components/MainPage/MainSelectBar";
import MainTutorial from "../Components/Tutorial/MainTutorial";

interface Select {
	select: string;
}

// ? Mode에 따른 컴포넌트 랜더링
function ChoiceMode(props: Select): JSX.Element {
	const { select } = props;
	if (select === "piano") return <MainPiano />;
	else if (select === "mic") return <MainMic />;
	else if (select === "upload") return <MainUpload />;
	else return <Error404 />;
}

const MainPage = (): JSX.Element => {
	const [select, setSelect] = useState("piano");
	const [openTutorial, setOpenTutorial] = useState<boolean>(true);

	//* 임시 코드: 모달창 다시 열기
	// localStorage.setItem("showTutorial", "true");
	//* --------------------------------------

	const handleBtnClick = (e: React.ChangeEvent<HTMLButtonElement>) => {
		setSelect(e.target.classList.value);
	};

	const handleCloseTutorial = (): void => {
		setOpenTutorial(false);
	};

	return (
		<>
			{openTutorial && localStorage.getItem("showTutorial") !== "false" ? (
				<MainTutorial handleCloseTutorial={handleCloseTutorial} checkboxOption={true} />
			) : (
				""
			)}
			<Navigation />
			<div className="main-page">
				<MainSelectBar select={select} handleBtnClick={handleBtnClick} />
				<ChoiceMode select={select} />
			</div>
			<Footer />
		</>
	);
};

export default MainPage;
