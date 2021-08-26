import React, { useState, useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";
import UploadModal from "../UploadModal";
import "../Styles/RecordCanvas.css";
import html2canvas from "html2canvas";
import { BubbleData } from "../../@type/request";

let recoding;

function RecordCanvas({ backColor, pickSpeed }: any): JSX.Element {
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

	// // ? # 원이 찍히는 속도 state
	// const [pickSpeed, setPickSpeed] = useState<number>(350);

	// ! ###### 소리에 따른 원의 크기 조절 함수 ######
	const getRadius = (viewPitch: number): number => {
		if (viewPitch <= 0) return 30;
		else if (viewPitch >= 0 && viewPitch < 50) return 100;
		else if (viewPitch >= 50 && viewPitch < 70) return 105;
		else if (viewPitch >= 70 && viewPitch < 90) return 110;
		else if (viewPitch >= 90 && viewPitch < 110) return 120;
		else if (viewPitch >= 110 && viewPitch < 130) return 130;
		else if (viewPitch >= 130 && viewPitch < 150) return 140;
		else if (viewPitch >= 150 && viewPitch < 170) return 150;
		else if (viewPitch >= 170 && viewPitch < 190) return 155;
		else if (viewPitch >= 190 && viewPitch < 210) return 160;
		else if (viewPitch >= 210 && viewPitch < 230) return 170;
		else if (viewPitch >= 230 && viewPitch < 250) return 180;
		else if (viewPitch >= 250 && viewPitch < 260) return 185;
		else if (viewPitch >= 260 && viewPitch < 270) return 190;
		else if (viewPitch >= 270 && viewPitch < 280) return 200;
		return 210;
	};

	const [recoder, setRecoder] = useState<MediaRecorder | null>(null);

	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: null,
		sound: null,
	});

	async function getMicrophone() {
		console.log("start!");
		console.log("시작 속도", pickSpeed);
		// ? # 미디어 입력 장치 사용 권한 요청
		const audio = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		});

		setAudio(audio);

		//! mic record
		//* --------------------------------------
		const options = {
			audioBitsPerSecond: 128000,
			mimeType: "audio/webm", // webm밖에 지원하지 않음
		};

		const micRecoder: MediaRecorder = await new MediaRecorder(audio, options);
		setRecoder(micRecoder);
		micRecoder.start();

		const recordedChunks: Blob[] = [];

		//micRecoder에 이벤트 등록. stop 호출 시 dataavailable -> stop
		micRecoder.addEventListener("dataavailable", function (event) {
			console.log("event: dataavailable");
			if (event.data.size > 0) {
				recordedChunks.push(event.data);
			}
			console.log("recordedChunks", recordedChunks);
		});

		micRecoder.addEventListener("stop", function () {
			console.log("event: stop");
			// Blob 객체를 생성할 때 type을 변경해도 표기만 바꾸는 것, wav로 바꿔도 실제로 변환 x
			const soundBlob = new Blob(recordedChunks, { type: "audio/webm" });
			const soundFile = new File([soundBlob], "sound.webm", { type: soundBlob.type });
			setBubbleData(Object.assign(bubbleData, { sound: soundFile }));
		});
		//* --------------------------------------

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

			// 녹음 중지
			if (recoder) recoder.stop();
		}
		clearTimeout(recoding);
	}

	function toggleMicrophone() {
		if (audio) {
			stopMicrophone();
			setBubbleIsClicked(false);

			const canvas = canvasRef.current;
			if (!canvas) throw new Error("error");

			//* use html2canvas
			html2canvas(canvas, { allowTaint: true, backgroundColor: "rgba(0,0,0,0)" }).then(canvas => {
				canvas.toBlob(imageBlob => {
					if (!imageBlob) throw new Error("error");
					const imageFile = new File([imageBlob], "image.png", { type: imageBlob.type });
					setBubbleData(Object.assign(bubbleData, { image: imageFile }));

					handleUploadModal();
				}, "image/png");
			});
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
			x: Number(getRandom(0, 700)),
			y: Number(getRandom(0, 700)),
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
		context.filter = "blur(2px)";
		context.fillStyle = `${
			viewPitch > 260
				? `hsla(${viewPitch * voiceConstant}, 100%, 50%, 0.75)`
				: `hsla(${viewPitch * voiceConstant}, 100%, 75%, 0.6)`
		}`;
		context?.fill();
		const image = canvas?.toDataURL();
		setViewImage(image);
	};

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

	// ? # 저장하기 버튼
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

	function circleSize(viewPitch: number) {
		if (viewPitch > 500) return 1.13;
		return 1 + viewPitch / 4000;
	}

	// ? # pitch값이 바뀔때마다 그림이 그려짐.
	useEffect(() => {
		handlePainting(viewPitch);
		circleSize(viewPitch);
		console.log("소리에 따른 원 크기", circleSize(viewPitch));
		document.documentElement.style.setProperty("--circleSize", `${circleSize(viewPitch)}`);

		const canvas = canvasRef.current;
		if (!canvas) throw new Error("error");
		html2canvas(canvas, { allowTaint: true, backgroundColor: "rgba(0,0,0,0)" }).then(canvas => {
			const image = canvas?.toDataURL();
			setViewImage(image);
		});
	}, [viewPitch]);

	useEffect(() => {
		colorChange(backColor);
	}, [backColor]);

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
					viewImage={viewImage}
					bubbleData={bubbleData}
				/>
			) : null}
			<div className="get-color-box">
				<div className="option-left"></div>
				<div className="circle-right">
					{bubbleIsClicked ? (
						<canvas
							width="500"
							height="500"
							onClick={toggleMicrophone}
							className="canvas backLight"
							ref={canvasRef}
						></canvas>
					) : (
						<canvas width="500" height="500" onClick={toggleMicrophone} className="canvas" ref={canvasRef}></canvas>
					)}
				</div>
			</div>
		</>
	);
}

export default RecordCanvas;
