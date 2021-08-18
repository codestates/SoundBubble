import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart5.css";
import { useHistory } from "react-router-dom";

const LandingFifth = (): JSX.Element => {
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
			<div className="container5" ref={BackToTopRef}>
				<div className="messageWrapper">
					<h2>지금 체험해보세요</h2>
					<button className="startBtn" onClick={() => history.push("/main")}>
						시작하기
					</button>
				</div>
			</div>
		</>
	);
};

export default LandingFifth;
