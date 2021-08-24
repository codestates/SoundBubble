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
import { CirclePicker } from "react-color";

interface Select {
	select: string;
	backColor: any;
	pickSpeed: any;
}

// ? Mode에 따른 컴포넌트 랜더링
function ChoiceMode({ select, backColor, pickSpeed }: Select): JSX.Element {
	if (select === "piano") return <MainPiano />;
	else if (select === "mic") return <MainMic backColor={backColor} pickSpeed={pickSpeed} />;
	else if (select === "upload") return <MainUpload />;
	else return <Error404 />;
}

const MainPage = (): JSX.Element => {
	const history = useHistory();
	const [select, setSelect] = useState("mic");

	const [backColor, setBackColor] = useState<string>("white");
	// ? # 원이 찍히는 속도 state
	const [pickSpeed, setPickSpeed] = useState<number>(350);

	const handleBtnClick = (e: React.ChangeEvent<HTMLButtonElement>) => {
		setSelect(e.target.classList.value);
	};
	const handleChangeComplete = color => {
		setBackColor(color.hex);
	};

	return (
		<>
			<Navigation />
			<div className="main-page">
				<div className="main-left-background"></div>
				<div className="main-left">
					<MainSelectBar select={select} handleBtnClick={handleBtnClick} />
					<div className="bubble-color-box">
						<p className="bubble-color-message">color</p>
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
					<div className="bubble-speed-box">
						<p className="bubble-speed-message">speed</p>
						<input
							type="range"
							min="100"
							max="600"
							onChange={e => setPickSpeed(Number(e.target.value))}
							value={pickSpeed}
							className="speedSlider"
						/>
					</div>
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
