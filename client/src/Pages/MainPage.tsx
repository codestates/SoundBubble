import React, { useState } from "react";
import MainPiano from "../Components/MainPage/MainPiano";
import MainMic from "../Components/MainPage/MainMic";
import MainUpload from "../Components/MainPage/MainUpload";
import Error404 from "../Pages/error404";
import Navigation from "../Components/Navigation";
import Footer from "../Components/Footer";
import { useHistory } from "react-router-dom";

import "./Styles/MainPage.css";
import MainSelectBar from "../Components/MainPage/MainSelectBar";
import MainTutorial from "../Components/Tutorial/MainTutorial";
import { CirclePicker } from "react-color";

interface Select {
	select: string;
	backColor: any;
	pickSpeed: any;
}

// ? Mode에 따른 컴포넌트 랜더링
function ChoiceMode({ select, backColor, pickSpeed }: Select): JSX.Element {
	if (select === "piano") return <MainPiano backColor={backColor} />;
	else if (select === "mic") return <MainMic backColor={backColor} pickSpeed={pickSpeed} />;
	else if (select === "upload") return <MainUpload />;
	else return <Error404 />;
}

const MainPage = (): JSX.Element => {
	const [openTutorial, setOpenTutorial] = useState<boolean>(true);

	const history = useHistory();
	const [select, setSelect] = useState("mic");

	const [backColor, setBackColor] = useState<string>("white");
	// ? # 원이 찍히는 속도 state
	const [pickSpeed, setPickSpeed] = useState<number>(350);

	const handleBtnClick = (e: React.ChangeEvent<HTMLButtonElement>) => {
		setSelect(e.target.classList.value);
	};

	//* 임시 코드: 모달창 다시 열기
	// localStorage.setItem("showTutorial", "true");
	//* --------------------------------------

	const handleChangeComplete = color => {
		setBackColor(color.hex);
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
				<div className="main-left-background"></div>
				<div className="main-left">
					<MainSelectBar select={select} handleBtnClick={handleBtnClick} />
					<div className="bubble-color-box">
						<p className="bubble-color-message">Bubble Color</p>
						<div className="color-picker">
							<CirclePicker
								className="circle-picker"
								color={backColor}
								onChangeComplete={handleChangeComplete}
								width="400px"
							/>
							<button className="white-btn" onClick={() => setBackColor("#FFFFFF")}></button>
							<button className="black-btn" onClick={() => setBackColor("#000000")}></button>
						</div>
					</div>
					{select === "mic" ? (
						<div className="bubble-speed-box">
							<p className="bubble-speed-message">Mic Sensitivity</p>
							<input
								type="range"
								min="100"
								max="600"
								onChange={e => setPickSpeed(Number(e.target.value))}
								value={pickSpeed}
								className="speedSlider"
							/>
						</div>
					) : null}
					<div className="bubble-btn-box">
						<button
							className="reset-btn"
							onClick={() => {
								window.location.replace("/main");
							}}
						>
							Reset
						</button>
						<button className="reset-btn" onClick={() => window.location.replace("/palette")}>
							Palette
						</button>
					</div>
				</div>
				<ChoiceMode select={select} backColor={backColor} pickSpeed={pickSpeed} />
			</div>
			<Footer />
		</>
	);
};

export default MainPage;
