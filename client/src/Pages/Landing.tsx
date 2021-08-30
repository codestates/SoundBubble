import React, { useCallback, useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import LandingFirst from "./Landing/LandingPart1";
import LandingSecond from "./Landing/LandingPart2";
import LandingThird from "./Landing/LandingPart3";
import LandingFourth from "./Landing/LandingPart4";
import LandingFifth from "./Landing/LandingPart5";

const Landing = (): JSX.Element => {
	const [isScroll, setIsScroll] = useState<boolean>(false);

	const onScrollEvent = useCallback(() => {
		if (window.pageYOffset > 0) {
			setIsScroll(true);
		}
		if (window.pageYOffset === 0) {
			setIsScroll(false);
		}
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
		window.addEventListener("mousewheel", onScrollEvent);
		return () => {
			window.removeEventListener("mousewheel", onScrollEvent);
		};
	}, []);
	return (
		<>
			<Navigation />
			<LandingFirst />
			<LandingSecond />
			<LandingThird />
			<LandingFourth />
			<LandingFifth />
			<Footer />
		</>
	);
};

export default Landing;
