import React, { Fragment } from "react";
import Instrument from "./Instrument";
import "./Piano2.css";

const Piano3 = ({ handleClick }) => {
	const accidentalKey = ({ isPlaying, text, eventHandlers }) => {
		return (
			<div className="piano-accisdental-key-wrapper">
				<button
					className={`piano-accidental-key ${isPlaying ? "piano-accidental-key-playing" : ""} `}
					{...eventHandlers}
				>
					<div className="piano-text">{text}</div>
				</button>
			</div>
		);
	};

	const naturalKey = ({ isPlaying, text, eventHandlers }) => {
		return (
			<button className={`piano-natural-key ${isPlaying ? "piano-natural-key-playing" : ""} `} {...eventHandlers}>
				<div className="piano-text">{text}</div>
			</button>
		);
	};

	const renderPianoKey = ({ isAccidentalNote, isNotePlaying, startPlayingNote, stopPlayingNote, keyboardShortcut }) => {
		const KeyComponent = isAccidentalNote ? accidentalKey : naturalKey;

		const eventHandlers = {
			onMouseDown: startPlayingNote,
			onMouseUp: stopPlayingNote,
			onTouchStart: startPlayingNote,
			onMouseOut: stopPlayingNote,
			onTouchEnd: stopPlayingNote,
		};

		return <KeyComponent isPlaying={isNotePlaying} text={keyboardShortcut.join("/")} eventHandlers={eventHandlers} />;
	};

	return (
		<div className="piano-container">
			<Instrument
				instrumentName={"acoustic_grand_piano"}
				startNote={"C3"}
				endNote={"C4"}
				renderPianoKey={renderPianoKey}
				handleClick={handleClick}
				keyboardMap={{
					Q: "C3",
					2: "C#3",
					W: "D3",
					3: "D#3",
					E: "E3",
					R: "F3",
					5: "F#3",
					T: "G3",
					6: "G#3",
					Y: "A3",
					7: "A#3",
					U: "B3",
					I: "C4",
				}}
			/>
		</div>
	);
};

export default Piano3;
