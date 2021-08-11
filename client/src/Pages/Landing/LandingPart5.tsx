import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart5.css';

const LandingFifth = () => {
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
      <div className="container5" ref={BackToTopRef} >
        다섯번째 랜딩페이지 - 메인페이지로 이동
        <div className="messageWrapper"> 지금 체험해보세요 
        <button className="startBtn"> <p> 시작하기 </p> </button>
        </div>
      </div>
		</>
	);
}

export default LandingFifth;