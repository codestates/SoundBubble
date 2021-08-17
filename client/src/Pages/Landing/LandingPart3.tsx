import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart3.css";
import Piano from "../../Components/Piano/Piano";
import clickIcon from "../../Static/icons/clickIcon.png";

const LandingThird = (): JSX.Element => {
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(e.currentTarget.value);
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
					<div className="clickBtn">
						<div className="innerCircle">
							<img src={clickIcon} alt="클릭아이콘" width="45px" height="50px"></img>
						</div>
					</div>
					<Piano handleClick={handleClick} />
				</div>
			</div>
		</>
	);
};

export default LandingThird;
