import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart3.css";
import Piano from "../../Components/Piano/Piano";
import clickIcon from "../../Static/icons/clickIcon.png";

const LandingThird = (): JSX.Element => {
	const container = document.querySelector(".container3");
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const [fingerBtn, setFingerBtn] = useState(
		<div className="clickBtn">
			<div className="innerCircle">{<img src={clickIcon} alt="클릭아이콘" width="45px" height="50px"></img>}</div>
		</div>,
	);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setFingerBtn(<span />);
		const circle = document.createElement("div");
		const note = e.currentTarget.value;
		const yPos = `${container ? Math.floor(container.clientHeight * Math.random()) / 2 : Number}px`;
		const xPos = `${container ? Math.floor(container.clientWidth * Math.random()) : Number}px`;
		circle.classList.add("sound-circle");
		circle.style.left = xPos;
		circle.style.top = yPos;
		circle.style.animationDuration = "1.8s";
		container?.append(circle);

		switch (note) {
			case "C":
				circle.style.backgroundColor = "#FFAFB0";
				break;
			case "CSharp":
				circle.style.backgroundColor = "#FFAFD8";
				break;
			case "D":
				circle.style.backgroundColor = "#F2CFA5";
				break;
			case "DSharp":
				circle.style.backgroundColor = "#FFE4AF";
				break;
			case "E":
				circle.style.backgroundColor = "#FDFA87";
				break;
			case "F":
				circle.style.backgroundColor = "#AFFFBA";
				break;
			case "FSharp":
				circle.style.backgroundColor = "#E2FFAF";
				break;
			case "G":
				circle.style.backgroundColor = "#AEE4FF";
				break;
			case "GSharp":
				circle.style.backgroundColor = "#98e2dc";
				break;
			case "A":
				circle.style.backgroundColor = "#FCC6F7";
				break;
			case "ASharp":
				circle.style.backgroundColor = "#B5C7ED";
				break;
			case "B":
				circle.style.backgroundColor = "#cfa5f1";
				break;
			default:
				circle.style.left = "0px";
		}
		const audio = new Audio(`sounds/piano_${e.currentTarget.value}.mp3`);
		audio.play();
	};

	const onScroll = useCallback((): void => {
		setScrollPosition(window.pageYOffset);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<div className="container3">
				<div className="contentWrap3">
					<div className="circle"></div>
					<h2>건반을 클릭해보세요</h2>
					{fingerBtn}
					<Piano handleClick={handleClick} />
				</div>
			</div>
		</>
	);
};

export default LandingThird;
