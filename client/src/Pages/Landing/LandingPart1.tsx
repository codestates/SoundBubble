import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart1.css';

const LandingFirst = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const BackToTopRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback((): void => {
		setScrollPosition(window.pageYOffset);
  }, []);
  
  useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <>
      <div className="container1" ref={BackToTopRef}>
        첫번째 랜딩페이지 - 색청 소개
      </div>
		</>
	);
}

export default LandingFirst;