import React, { useCallback, useEffect, useState } from 'react';
import Footer from "../Components/Footer";
import LandingFirst from './Landing/LandingPart1';
import LandingSecond from './Landing/LandingPart2';
import LandingThird from './Landing/LandingPart3';
import LandingFourth from './Landing/LandingPart4';
import LandingFifth from './Landing/LandingPart5';

const Landing = () => {
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
		window.addEventListener('mousewheel', onScrollEvent);
		return () => {
			// TODO: 메모리 누수 방지
			window.removeEventListener('mousewheel', onScrollEvent);
		};
	}, []);
  return (
    <>
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
