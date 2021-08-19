import React, { useState, useEffect, useRef } from "react";
import "../Styles/MainPiano.css";
import Piano from "../../Components/Piano/Piano";
import UploadModal from "../../Components/UploadModal";

interface BubbleData {
	image: string;
	sound: string;
}

const MainPiano = (): JSX.Element => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();
	const [viewImage, setViewImage] = useState("");
	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: "dummyImage",
		sound: "dummySound",
	});
	const handlePainting = (note: string) => {
		const randomPosition = {
			x: Number(getRandom(0, 400)),
			y: Number(getRandom(0, 400)),
		};

		console.log(`(${randomPosition.x},${randomPosition.y})좌표`);
		const canvas = canvasRef.current;

		if (!canvas) throw new Error("error");
		const context = canvas?.getContext("2d");
		const image = canvas?.toDataURL();
		setViewImage(image);

		if (!context) throw new Error("error");
		context.filter = "blur(16px)";
		context?.beginPath();
		context?.arc(randomPosition.x / 1.5, randomPosition.y / 2, 50, 0, 2 * Math.PI, true);

		switch (note) {
			case "C":
				context.fillStyle = "#FFAFB0";
				break;
			case "CSharp":
				context.fillStyle = "#FFAFD8";
				break;
			case "D":
				context.fillStyle = "#F2CFA5";
				break;
			case "DSharp":
				context.fillStyle = "#FFE4AF";
				break;
			case "E":
				context.fillStyle = "#FDFA87";
				break;
			case "F":
				context.fillStyle = "#AFFFBA";
				break;
			case "FSharp":
				context.fillStyle = "#E2FFAF";
				break;
			case "G":
				context.fillStyle = "#AEE4FF";
				break;
			case "GSharp":
				context.fillStyle = "#DFD4E4";
				break;
			case "A":
				context.fillStyle = "#FCC6F7";
				break;
			case "ASharp":
				context.fillStyle = "#B5C7ED";
				break;
			case "B":
				context.fillStyle = "#C695FA";
				break;
			default:
				context.fillStyle = "white";
		}
		context?.fill();
	};

	function handleSaveClick() {
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		const image = canvas?.toDataURL();
		const link = document.createElement("a");
		link.href = image;
		link.download = "myBubble";
		link.click();
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
		handlePainting(note);
		const audio = new Audio(`sounds/piano_${e.currentTarget.value}.mp3`);
		audio.play();
	};
	return (
		<>
			{isModal ? (
				<UploadModal
					handleCloseModal={handleCloseModal}
					handleSaveClick={handleSaveClick}
					bubbleData={bubbleData}
					viewImage={viewImage}
				/>
			) : null}
			<div className="main-page__piano">
				<canvas id="canvas" ref={canvasRef}></canvas>
				<Piano handleClick={handleClick} />
				<button onClick={handleUploadModal} className="create-bubble-btn">
					Create Bubble !
				</button>
			</div>
		</>
	);
};

export default MainPiano;
