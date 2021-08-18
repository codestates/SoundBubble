import React, { useState, useEffect } from "react";
import { PitchDetector } from "pitchy";
import UploadModal from "../../Components/UploadModal";
import "../Styles/Record.css";

let recoding;

interface BubbleData {
	image: string;
	sound: string;
	textContent: string;
}

function Record(): JSX.Element {
	const [audio, setAudio] = useState<MediaStream | null>(null);
	const [viewPitch, setPitch] = useState<number>(0);
	const [viewClarity, setClarity] = useState<number>(0);
	const [audioUrl, setAudioUrl] = useState();
	const [media, setMedia] = useState();
	const [bubbleData, setBubbleData] = useState<BubbleData>({
		image: "dummyImage",
		sound: "dummySound",
		textContent: "dummyText",
	});

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
		// ? # 1초에 한번씩 피치값 갱신
		recoding = setTimeout(() => {
			updatePitch(analyserNode, detector, input, sampleRate);
		}, 1000);
	}

	const handlePainting = (viewPitch: number) => {
		console.log(`${viewPitch}Hz를 가진 색을 찍어보자`);
	};

	useEffect(() => {
		handlePainting(viewPitch);
	}, [viewPitch]);

	const [isModal, setIsModal] = useState(true);

	const handleCloseModal = () => {
		setIsModal(false);
	};
	const getAudio = () => {
		console.log(audio?.getTracks());
	};
	const handleUploadModal = () => {
		setIsModal(true);
	};

	return (
		<>
			{isModal ? <UploadModal handleCloseModal={handleCloseModal} bubbleData={bubbleData} /> : null}
			<div className="get-color-box">
				<button
					className="audio-btn"
					onClick={toggleMicrophone}
					style={{
						background: `hsl(${viewPitch}, 100%, ${viewPitch > 260 ? "85%" : "40%"})`,
					}}
					onMouseDown={e => {
						console.log("client", e.nativeEvent.clientX, e.nativeEvent.clientY);
						console.log("screen", e.nativeEvent.screenX, e.nativeEvent.screenY);
						console.log("page", e.nativeEvent.pageX, e.nativeEvent.pageY);
					}}
				></button>
				<button className="upload-btn" onClick={handleUploadModal}>
					Upload
				</button>
				<button className="upload-btn" onClick={getAudio}>
					test
				</button>
			</div>
		</>
	);
}

export default Record;
