import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart2.css';

const LandingSecond = () => {
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
      <div className="container2" ref={BackToTopRef}>
        두번째 랜딩페이지 - 서비스 소개
      </div>
		</>
	);
}

export default LandingSecond;