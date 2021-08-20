import React, { useState, useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";
import UploadModal from "../UploadModal";
import "../Styles/RecordCanvas.css";

let recoding;

function RecordCanvas(): JSX.Element {
	// ? # 인풋된 소리에 대한 state
	const [audio, setAudio] = useState<MediaStream | null>(null);

	// ? # 인풋된 소리가 Hz로 변환된 state
	const [viewPitch, setPitch] = useState<number>(0);

	// ? # 변환된 Hz의 정확도 체크를 위한 state
	const [viewClarity, setClarity] = useState<number>(0);

	// ? # 생성된 이미지 state
	const [viewImage, setViewImage] = useState("");

	// ? # 소리 인풋값을 시작할때 누르는 state
	const [bubbleIsClicked, setBubbleIsClicked] = useState<boolean>(false);

	// ? # 원이 찍히는 속도 state
	const [pickSpeed, setPickSpeed] = useState<number>(350);

	// ! ###### 소리에 따른 원의 크기 조절 함수 ######
	const getRadius = (viewPitch: number): number => {
		if (viewPitch <= 0) return 30;
		else if (viewPitch >= 0 && viewPitch < 50) return 30;
		else if (viewPitch >= 50 && viewPitch < 70) return 40;
		else if (viewPitch >= 70 && viewPitch < 90) return 50;
		else if (viewPitch >= 90 && viewPitch < 110) return 60;
		else if (viewPitch >= 110 && viewPitch < 130) return 70;
		else if (viewPitch >= 130 && viewPitch < 150) return 75;
		else if (viewPitch >= 150 && viewPitch < 170) return 80;
		else if (viewPitch >= 170 && viewPitch < 190) return 85;
		else if (viewPitch >= 190 && viewPitch < 210) return 90;
		else if (viewPitch >= 210 && viewPitch < 230) return 95;
		else if (viewPitch >= 230 && viewPitch < 250) return 100;
		else if (viewPitch >= 250 && viewPitch < 260) return 105;
		else if (viewPitch >= 260 && viewPitch < 270) return 110;
		else if (viewPitch >= 270 && viewPitch < 280) return 115;
		return 120;
	};

	async function getMicrophone() {
		console.log("start!");
		console.log("시작 속도", pickSpeed);
		// ? # 미디어 입력 장치 사용 권한 요청
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
		if (audio) {
			stopMicrophone();
			setBubbleIsClicked(false);
			handleUploadModal();
		} else {
			getMicrophone();
			setBubbleIsClicked(true);
		}
	}

	function updatePitch(analyserNode, detector, input, sampleRate) {
		analyserNode.getFloatTimeDomainData(input);
		const [pitch, clarity]: number[] = detector.findPitch(input, sampleRate);
		const clarityPercent = Math.round(clarity * 100);
		if (clarityPercent >= 80) {
			// ? # 80% 정확도인 피치만 출력
			setPitch(Math.round(pitch * 10) / 10);
			setClarity(Math.round(clarity * 100));
		}
		// ? # n초에 한번씩 피치값 갱신
		recoding = setTimeout(() => {
			updatePitch(analyserNode, detector, input, sampleRate);
		}, pickSpeed);
	}

	// ? ###### random하게 좌표를 찍어서 캔버스에 그림을 찍는 과정 ######
	// ? ###### random하게 좌표를 찍어서 캔버스에 그림을 찍는 과정 ######
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getRandom = (min: number, max: number): string => Math.floor(Math.random() * (max - min) + min).toString();

	const handlePainting = (viewPitch: number) => {
		// ? # 랜덤 값 상수
		const randomPosition = {
			x: Number(getRandom(0, 400)),
			y: Number(getRandom(0, 400)),
			voiceConstant: 2.7,
			voiceStrong: 360,
		};
		const { x, y, voiceConstant, voiceStrong } = randomPosition;
		// ! # 색 찍히는 가이드 콘솔
		if (viewPitch > voiceStrong)
			console.log(
				`소리:${viewPitch}Hz 정확도:${viewClarity}% 좌표:(${randomPosition.x},${
					randomPosition.y
				}) 원 크기(mm):${getRadius(viewPitch)} 강한 색! `,
			);
		else
			console.log(
				`소리:${viewPitch}Hz 정확도:${viewClarity}% 좌표:(${randomPosition.x},${
					randomPosition.y
				}) 원 크기(mm):${getRadius(viewPitch)}`,
			);

		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		const context = canvas?.getContext("2d");
		if (!context) throw new Error("error");
		context?.beginPath();
		context?.arc(x, y, getRadius(viewPitch), 0, 2 * Math.PI);
		context.filter = "blur(4px)";
		context.fillStyle = `${
			viewPitch > 260
				? `hsla(${viewPitch * voiceConstant}, 100%, 50%, 0.75)`
				: `hsla(${viewPitch * voiceConstant}, 100%, 75%, 0.6)`
		}`;
		context?.fill();
		const image = canvas?.toDataURL();
		setViewImage(image);
	};

	// ? # 버블 이미지 초기화
	const defaultBackground = () => {
		console.log("white painting");
		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		const context = canvas?.getContext("2d");
		if (!context) throw new Error("error");
		context?.beginPath();
		context.fillStyle = `white`;
		context?.fillRect(0, 0, 400, 400);
		const image = canvas?.toDataURL();
		setViewImage(image);
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

	useEffect(() => {
		defaultBackground();
	}, []);

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
				<UploadModal handleCloseModal={handleCloseModal} handleSaveClick={handleSaveClick} viewImage={viewImage} />
			) : null}
			<div className="get-color-box">
				{bubbleIsClicked ? (
					<canvas
						width="400"
						height="400"
						onClick={toggleMicrophone}
						className="canvas backLight"
						ref={canvasRef}
					></canvas>
				) : (
					<canvas width="400" height="400" onClick={toggleMicrophone} className="canvas" ref={canvasRef}></canvas>
				)}
				<button onClick={defaultBackground} className="reset-btn">
					Reset
				</button>
				<input
					type="range"
					min="100"
					max="600"
					onChange={e => setPickSpeed(Number(e.target.value))}
					value={pickSpeed}
					className="speedSlider"
				/>
			</div>
		</>
	);
}

export default RecordCanvas;
