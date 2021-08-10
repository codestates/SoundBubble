import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart4.css';

const LandingFourth = () => {
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
      <div className="container4" ref={BackToTopRef} >
        네번째 랜딩페이지 - 메인페이지로 이동
        <p>
          <a href="/main" className="myButton">체험하기</a>
        </p>
      </div>
      
		</>
	);
}

export default LandingFourth;