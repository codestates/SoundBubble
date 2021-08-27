import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/MainPiano.css";
import Piano from "../Piano/Piano";
import Piano2 from "../Piano2/Piano2";
import Piano3 from "../Piano2/Piano3";
import UploadModal from "../../Components/UploadModalPiano";
import { BubbleData } from "../../@type/request";
import upArrow from "../Styles/arrow-up.png";
import downArrow from "../Styles/arrow-down.png";
import html2canvas from "html2canvas";

const MainPiano = ({ backColor }: any): JSX.Element => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();
	const [viewImage, setViewImage] = useState("");
	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: null,
		sound: null,
	});

	const colorChange = (color: string) => {
		console.log("white painting");
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		const context = canvas?.getContext("2d");
		if (!context) throw new Error("error");
		context?.beginPath();
		context.fillStyle = `${color}`;
		context?.fillRect(0, 0, 1000, 1000);

		const image = canvas?.toDataURL();
		setViewImage(image);
	};

	useEffect(() => {
		colorChange(backColor);
	}, [backColor]);

	const [smallPiano, setSmallPiano] = useState(false);

	const [windowSize, setWindowSize] = useState(window.innerWidth);

	const handleWindowResize = useCallback(event => {
		setWindowSize(window.innerWidth);
	}, []);

	useEffect(() => {
		console.log("###", windowSize);
		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [handleWindowResize]);

	const handlePainting = (note: string) => {
		const randomPosition = {
			x: Number(getRandom(0, 500)),
			y: Number(getRandom(0, 500)),
		};
		const canvas = canvasRef.current;

		if (!canvas) return;
		const context = canvas?.getContext("2d");
		const image = canvas?.toDataURL();
		setViewImage(image);

		if (!context) throw new Error("error");
		context.filter = "blur(4px)";
		context?.beginPath();

		if (smallPiano) {
			context?.arc(randomPosition.x * 0.7, randomPosition.y * 0.7, 50, 0, 2 * Math.PI, true);
		} else {
			context?.arc(randomPosition.x * 1.2, randomPosition.y * 1.2, 80, 0, 2 * Math.PI, true);
		}

		switch (note) {
			case "C3": // 빨
				context.fillStyle = "hsla(2.7, 100%, 95%, 0.6)"; // 3도 - 95%, 4도 - 75%, 5도 - 55%
				break;
			case "C#3":
				context.fillStyle = "hsla(22, 100%, 95%, 0.6)";
				break;
			case "D3": // 주
				context.fillStyle = "hsla(42, 100%, 95%, 0.6)";
				break;
			case "D#3":
				context.fillStyle = "hsla(56, 100%, 95%, 0.6)";
				break;
			case "E3": // 노
				context.fillStyle = "hsla(70, 100%, 95%, 0.6)";
				break;
			case "F3": // 초
				context.fillStyle = "hsla(120, 100%, 95%, 0.6)";
				break;
			case "F#3":
				context.fillStyle = "hsla(180, 100%, 95%, 0.6)";
				break;
			case "G3": // 파
				context.fillStyle = "hsla(220, 100%, 95%, 0.6)";
				break;
			case "G#3":
				context.fillStyle = "hsla(245, 100%, 95%, 0.6)";
				break;
			case "A3": // 남
				context.fillStyle = "hsla(270 ,100%, 95%, 0.6)";
				break;
			case "A#3":
				context.fillStyle = "hsla(295 ,100%, 95%, 0.6)";
				break;
			case "B3": // 보
				context.fillStyle = "hsla(320 ,100%, 95%, 0.6)";
				break;
			case "C4":
				context.fillStyle = "hsla(2.7, 100%, 75%, 0.6)";
				break;
			case "C#4":
				context.fillStyle = "hsla(22, 100%, 75%, 0.6)";
				break;
			case "D4": // 주
				context.fillStyle = "hsla(42, 100%, 75%, 0.6)";
				break;
			case "D#4":
				context.fillStyle = "hsla(56, 100%, 75%, 0.6)";
				break;
			case "E4": // 노
				context.fillStyle = "hsla(70, 100%, 75%, 0.6)";
				break;
			case "F4": // 초
				context.fillStyle = "hsla(120, 100%, 75%, 0.6)";
				break;
			case "F#4":
				context.fillStyle = "hsla(180, 100%, 75%, 0.6)";
				break;
			case "G4": // 파
				context.fillStyle = "hsla(220, 100%, 75%, 0.6)";
				break;
			case "G#4":
				context.fillStyle = "hsla(245, 100%, 75%, 0.6)";
				break;
			case "A4": // 보
				context.fillStyle = "hsla(270 ,100%, 75%, 0.6)";
				break;
			case "A#4":
				context.fillStyle = "hsla(295 ,100%, 75%, 0.6)";
				break;
			case "B4": // 핑
				context.fillStyle = "hsla(320 ,100%, 75%, 0.6)";
				break;
			case "C5":
				context.fillStyle = "hsla(2.7, 100%, 55%, 0.6)";
				break;
			case "C#5":
				context.fillStyle = "hsla(22, 100%, 55%, 0.6)";
				break;
			case "D5": // 주
				context.fillStyle = "hsla(42, 100%, 55%, 0.6)";
				break;
			case "D#5":
				context.fillStyle = "hsla(56, 100%, 55%, 0.6)";
				break;
			case "E5": // 노
				context.fillStyle = "hsla(70, 100%, 55%, 0.6)";
				break;
			case "F5": // 초
				context.fillStyle = "hsla(120, 100%, 55%, 0.6)";
				break;
			case "F#5":
				context.fillStyle = "hsla(180, 100%, 55%, 0.6)";
				break;
			case "G5": // 파
				context.fillStyle = "hsla(220, 100%, 55%, 0.6)";
				break;
			case "G#5":
				context.fillStyle = "hsla(245, 100%, 55%, 0.6)";
				break;
			case "A5": // 남
				context.fillStyle = "hsla(270 ,100%, 55%, 0.6)";
				break;
			case "A#5":
				context.fillStyle = "hsla(295 ,100%, 55%, 0.6)";
				break;
			case "B5": // 보
				context.fillStyle = "hsla(320 ,100%, 55%, 0.6)";
				break;
			default:
				context.fillStyle = "white";
		}
		context?.fill();
	};

	function handleSaveClick() {
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");

		html2canvas(canvas, { allowTaint: true, backgroundColor: "rgba(0,0,0,0)" }).then(canvas => {
			const image = canvas?.toDataURL();
			const link = document.createElement("a");
			link.href = image;
			link.download = "myBubble";
			link.click();
		});
	}
	const [isModal, setIsModal] = useState(false);

	const handleUploadModal = () => {
		setIsModal(true);
	};

	const handleCloseModal = () => {
		setIsModal(false);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const note = e.currentTarget.value;
		if (!isModal && smallPiano) handlePainting(note);
		const audio = new Audio(`sounds/piano_${note}.mp3`);
		audio.play();
	};

	const handleClickPiano2 = (note: string) => {
		if (!smallPiano) handlePainting(note);
	};

	const [pianoState, setPianoState] = useState(false);

	const pianoToggle = () => {
		if (pianoState) setPianoState(false);
		else setPianoState(true);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		html2canvas(canvas, { allowTaint: true, backgroundColor: "rgba(0,0,0,0)" }).then(canvas => {
			const image = canvas?.toDataURL();
			setViewImage(image);
		});
	}, [viewImage]);
	return (
		<>
			{isModal ? (
				<UploadModal
					bubbleData={bubbleData}
					handleCloseModal={handleCloseModal}
					handleSaveClick={handleSaveClick}
					viewImage={viewImage}
				/>
			) : null}
			<div className="main-page__piano">
				<>
					<canvas id="canvas" width="500px" height="500px" onClick={handleUploadModal} ref={canvasRef}></canvas>
					<img className="noiseImg" src="noise.png" height="500" width="500" onClick={handleUploadModal} />
					<div className="main-content-box">
						{pianoState ? (
							<>
								<div className="piano-long">
									<img src={upArrow} alt="up" onClick={pianoToggle} className="btn" />
									<div className="main-content-box-piano" style={{ display: "none" }}>
										<Piano2 handleClick={handleClickPiano2} />
									</div>
								</div>
								<div className="piano-short">
									<img src={upArrow} alt="up" onClick={pianoToggle} className="btn" />
									<div className="main-content-box-piano" style={{ display: "none" }}>
										<Piano3 handleClick={handleClickPiano2} />
									</div>
								</div>
							</>
						) : (
							<>
								<div className="piano-long">
									<img src={downArrow} alt="down" onClick={pianoToggle} className="btn" />
									<div className="main-content-box-piano">
										<Piano2 handleClick={handleClickPiano2} />
									</div>
								</div>
								<div className="piano-short">
									<img src={downArrow} alt="up" onClick={pianoToggle} className="btn" />
									<div className="main-content-box-piano">
										<Piano3 handleClick={handleClickPiano2} />
									</div>
								</div>
							</>
						)}
					</div>
				</>
			</div>
		</>
	);
};

export default MainPiano;
