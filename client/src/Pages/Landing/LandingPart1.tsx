import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart1.css";
import "../Styles/Reset.css";
import { IoIosArrowUp } from "react-icons/io";
import { useHistory } from "react-router-dom";
import scrolldown from "../Styles/scrollarrowtodown.png";

const LandingFirst = (): JSX.Element => {
	const history = useHistory();
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const BackToTopRef = useRef<HTMLDivElement>(null);

	const onScroll = useCallback((): void => {
		setScrollPosition(window.pageYOffset);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<div className="container1" ref={BackToTopRef}>
				<div
					className="toTopBtnWrapper"
					style={{
						opacity: `${scrollPosition > 100 ? `1` : `0`}`,
						color: `${
							(scrollPosition > 100 && scrollPosition < 2530) ||
							(scrollPosition > 6680 && scrollPosition < 10330) ||
							scrollPosition > 11375
								? `#fff`
								: `#000`
						}`,
						transition: "0.3s",
					}}
					onClick={(): void => {
						if (BackToTopRef.current) {
							BackToTopRef.current.scrollIntoView({
								behavior: "smooth",
							});
						}
					}}
				>
					<button className="toTopBtn">
						<IoIosArrowUp className="toTopIcon" />
					</button>
				</div>
				<video className="video" id="background-video" autoPlay muted loop width="100%" height="100%">
					<source src="Blow1219.mp4" type="video/mp4" />
				</video>
				<div className="contentsWrapper">
					<div className="textWrap">
						<h1>당신의 소리는 어떤 색인가요?</h1>
						<h2>나만의 Sound Bubble을 만들어 보세요</h2>
					</div>
					<div className="btnWrap">
						<button className="mainBtn freeExpBtn" onClick={() => history.push("/main")}>
							빠른 시작
						</button>
						<button className="mainBtn paletteBtn" onClick={() => history.push("/palette")}>
							팔레트 구경하기
						</button>
					</div>

					<img className="scrolldown_img" src={scrolldown} />
				</div>
			</div>
		</>
	);
};

export default LandingFirst;
