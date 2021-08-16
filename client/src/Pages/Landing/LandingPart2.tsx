import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart2.css";
import "../Styles/Reset.css";

const LandingSecond = (): JSX.Element => {
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
			<div className="container2" ref={BackToTopRef}>
				<div className="chMessageWrapper">
					<div className="contentWrap">
						<div className="circle"></div>
						<h2>색청 (Colored Hearing)</h2>
						<p>
							색청은 소리를 듣고 자동으로 색을 보는 신비한 공감각 현상으로,
							<br></br>
							전세계에서 약 4%의 사람들만이 이러한 경험을 한다고 합니다.
						</p>
					</div>
				</div>
				<div className="chMessageWrapper2">
					<div className="contentWrap contentWrap2">
						<div className="circle"></div>
						<h2>Sound Bubble</h2>
						<p>
							Sound Bubble은 색청으로부터 영감을 얻어, 여러분이 <br></br>
							입력한 소리를 색으로 표현해주는 프로젝트입니다.<br></br>
							당신만의 소리를 <strong>세상에 하나뿐인 색</strong>으로 표현해보세요!
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default LandingSecond;
