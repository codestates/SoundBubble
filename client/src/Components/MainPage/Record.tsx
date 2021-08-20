import React, { useState, useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";
import UploadModal from "../../Components/UploadModal";
import "../Styles/Record.css";
import { BubbleData } from "../../@type/request";
import html2canvas from "html2canvas";

let recoding;

function Record(): JSX.Element {
	const [audio, setAudio] = useState<MediaStream | null>(null);
	const [viewPitch, setPitch] = useState<number>(0);
	const [viewClarity, setClarity] = useState<number>(0);
	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: null,
		sound: null,
	});

	const [viewImage, setViewImage] = useState("");
	const [isClicked, setIsClicked] = useState<boolean>(false);

	const [recoder, setRecoder] = useState<MediaRecorder | null>(null);

	async function getMicrophone() {
		console.log("start!");
		console.log("isclicked!", isClicked);
		// 미디어 입력 장치 사용 권한 요청
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
			console.log("soundBlob", soundBlob);
			const soundFile = new File([soundBlob], "sound.wav", { type: soundBlob.type });
			console.log("soundFile", soundFile);

			bubbleData.sound = soundFile;
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
			console.log("isclicked!", isClicked);
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
			setIsClicked(false);
			// handleUploadModal();

			//! Capture canvas
			// const canvas = canvasRef.current;
			// if (!canvas) throw new Error("error");
			// canvas.toBlob(imageBlob => {
			// 	console.log("imageBlob", imageBlob);
			// 	if(!imageBlob) throw new Error("error");
			// 	const imageFile = new File([imageBlob], "image.png", { type: imageBlob.type });
			// 	console.log("imageFile", imageFile);
			// 	bubbleData.image = imageFile;

			// 	handleUploadModal();
			// }, "image/png");

			//* use html2canvas
			html2canvas(document.getElementById("canvas")!, { allowTaint: true, backgroundColor: "rgba(0,0,0,0)" }).then(
				canvas => {
					canvas.toBlob(imageBlob => {
						console.log("imageBlob", imageBlob);
						if (!imageBlob) throw new Error("error");
						const imageFile = new File([imageBlob], "image.png", { type: imageBlob.type });
						console.log("imageFile", imageFile);
						bubbleData.image = imageFile;

						handleUploadModal();
					}, "image/png");
				},
			);
		} else {
			getMicrophone();
			setIsClicked(true);
		}
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
		}, 200);
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
		if (!context) throw new Error("error");
		context?.beginPath();
		context?.arc(randomPosition.x, randomPosition.y, 100, 0, 10 * Math.PI);
		context.fillStyle = `hsla(${viewPitch}, 100%, 40%,0.2)`;
		context?.fill();

		const image = canvas?.toDataURL();
		setViewImage(image);
	};

	const whitePainting = () => {
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
		whitePainting();
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
				<UploadModal
					handleCloseModal={handleCloseModal}
					handleSaveClick={handleSaveClick}
					bubbleData={bubbleData}
					viewImage={viewImage}
				/>
			) : null}
			<div className="get-color-box">
				{isClicked ? (
					<canvas onClick={toggleMicrophone} id="canvas" className="canvas backLight" ref={canvasRef}></canvas>
				) : (
					<canvas onClick={toggleMicrophone} className="canvas" ref={canvasRef}></canvas>
				)}
				<div
					className="audio-btn"
					style={{
						color: `hsl(${viewPitch}, 100%, ${viewPitch > 260 ? "85%" : "40%"})`,
					}}
				>
					원을 눌러 시작해주세요!
				</div>
				<button onClick={whitePainting} className="create-bubble-btn">
					다시 만들기
				</button>
			</div>
		</>
	);
}

export default Record;
