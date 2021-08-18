import React, { useState, useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";
import UploadModal from "../../Components/UploadModal";
import "../Styles/Record.css";

let recoding;

interface BubbleData {
	image: string;
	sound: string;
}

function Record(): JSX.Element {
	const [audio, setAudio] = useState<MediaStream | null>(null);
	const [viewPitch, setPitch] = useState<number>(0);
	const [viewClarity, setClarity] = useState<number>(0);
	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: "dummyImage",
		sound: "dummySound",
	});

	const [viewImage, setViewImage] = useState("");

	async function getMicrophone() {
		console.log("start!");
		// 미디어 입력 장치 사용 권한 요청
		const audio = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		});

		setAudio(audio);

		const audioContext = new window.AudioContext();
		const analyserNode = audioContext.createAnalyser();

		//* pitchy
		const sourceNode = audioContext.createMediaStreamSource(audio);
		sourceNode.connect(analyserNode);
		const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
		const input = new Float32Array(detector.inputLength);
		updatePitch(analyserNode, detector, input, audioContext.sampleRate);
	}

	function stopMicrophone() {
		if (audio) {
			console.log("stop!");
			audio.getTracks().forEach(track => track.stop());
			setAudio(null);
		}
		clearTimeout(recoding);
	}

	function toggleMicrophone() {
		if (audio) stopMicrophone();
		else getMicrophone();
	}

	function updatePitch(analyserNode, detector, input, sampleRate) {
		analyserNode.getFloatTimeDomainData(input);
		const [pitch, clarity]: number[] = detector.findPitch(input, sampleRate);
		const clarityPercent = Math.round(clarity * 100);
		if (clarityPercent >= 80) {
			// 80% 정확도인 피치만 출력
			setPitch(Math.round(pitch * 10) / 10);
			setClarity(Math.round(clarity * 100));
		}
		// ? # n초에 한번씩 피치값 갱신
		recoding = setTimeout(() => {
			updatePitch(analyserNode, detector, input, sampleRate);
		}, 100);
	}

	// ? ###### random하게 좌표를 찍어서 캔버스에 그림을 찍는 과정 ######
	// ? ###### random하게 좌표를 찍어서 캔버스에 그림을 찍는 과정 ######
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();

	const handlePainting = (viewPitch: number) => {
		const randomPosition = {
			x: Number(getRandom(0, 400)),
			y: Number(getRandom(0, 400)),
		};

		console.log(`(${randomPosition.x},${randomPosition.y})좌표에 ${viewPitch}Hz를 가진 색을 찍어보자`);
		const canvas = canvasRef.current;

		if (!canvas) throw new Error("error");
		const context = canvas?.getContext("2d");
		const image = canvas?.toDataURL();
		setViewImage(image);

		if (!context) throw new Error("error");
		context?.beginPath();
		context?.arc(randomPosition.x, randomPosition.y, 100, 0, 10 * Math.PI);
		context?.stroke();
		context?.fill();
		context.strokeStyle = "rgba(0,0,0,0)";
		context.fillStyle = `hsla(${viewPitch}, 100%, 40%,0.5)`;
	};

	// ? # 저장하기 버튼
	function handleSaveClick() {
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		const image = canvas?.toDataURL();
		const link = document.createElement("a");
		link.href = image;
		link.download = "myBubble";
		link.click();
	}

	// ? # pitch값이 바뀔때마다 그림이 그려짐.
	useEffect(() => {
		handlePainting(viewPitch);
	}, [viewPitch]);

	// ? # upload modal open / close
	const [isModal, setIsModal] = useState(false);
	const handleUploadModal = () => {
		setIsModal(true);
	};

	const handleCloseModal = () => {
		setIsModal(false);
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
			<div className="get-color-box">
				<canvas onClick={toggleMicrophone} className="canvas" ref={canvasRef}></canvas>
				<div
					className="audio-btn"
					style={{
						color: `hsl(${viewPitch}, 100%, ${viewPitch > 260 ? "85%" : "40%"})`,
					}}
				>
					원을 눌러 시작해주세요!
				</div>
				<button onClick={handleUploadModal} className="create-bubble-btn">
					버블 만들기
				</button>
			</div>
		</>
	);
}

export default Record;
