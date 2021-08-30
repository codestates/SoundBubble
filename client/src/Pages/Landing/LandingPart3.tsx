import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart3.css";
import Piano from "../../Components/Piano/Piano";
import clickIcon from "../../Static/icons/clickIcon.png";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingThird = (): JSX.Element => {
	const container = document.querySelector(".container3");
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const [fingerBtn, setFingerBtn] = useState(
		<div className="clickBtn">
			<div className="innerCircle">{<img className="icon" src={clickIcon} alt="클릭아이콘"></img>}</div>
		</div>,
	);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setFingerBtn(<span />);
		const circle = document.createElement("div");
		const note = e.currentTarget.value;
		const yPos = `${container ? Math.floor((container.clientHeight / 2) * Math.random()) : Number}px`;
		const xPos = `${container ? Math.floor(container.clientWidth * Math.random()) : Number}px`;
		circle.classList.add("sound-circle");
		circle.style.left = xPos;
		circle.style.top = yPos;
		circle.style.animationDuration = "1.8s";
		container?.append(circle);

		switch (note) {
			case "C":
				circle.style.backgroundColor = "#f38a8c";
				break;
			case "CSharp":
				circle.style.backgroundColor = "#FFAFD8";
				break;
			case "D":
				circle.style.backgroundColor = "#ffc379";
				break;
			case "DSharp":
				circle.style.backgroundColor = "#f5dc8b";
				break;
			case "E":
				circle.style.backgroundColor = "#f8f18b";
				break;
			case "F":
				circle.style.backgroundColor = "#68c55f";
				break;
			case "FSharp":
				circle.style.backgroundColor = "#adffe4";
				break;
			case "G":
				circle.style.backgroundColor = "#AEE4FF";
				break;
			case "GSharp":
				circle.style.backgroundColor = "#68c3ff";
				break;
			case "A":
				circle.style.backgroundColor = "#3c45a1";
				break;
			case "ASharp":
				circle.style.backgroundColor = "#e1a2ee";
				break;
			case "B":
				circle.style.backgroundColor = "#c38df5";
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
				<div className="contentWrap3" data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1000">
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
