import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/LandingPart4.css";
import instagramImg from "../../Static/instagram.png";

const LandingFourth = (): JSX.Element => {
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
			<div className="container4" ref={BackToTopRef}>
				<div className="imgWrap">
					{/* <div className="imgBox">
						<img src={instagramImg} alt="인스타그램" width="100%"></img>
					</div>
					<div className="imgBox">
						<img src={instagramImg} alt="인스타그램" width="100%"></img>
					</div>
					<div className="imgBox">
						<img src={instagramImg} alt="인스타그램" width="100%"></img>
					</div> */}
				</div>
			</div>
		</>
	);
};

export default LandingFourth;
