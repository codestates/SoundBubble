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
      <div className="container2" ref={BackToTopRef}
        // style={{
				// 	background: `no-repeat center/cover url(../Static/soundhearing.jpg)`,
        // }}
      >
        <div className="chMessageWrapper">
          <div className="messageTitle">
                색청 (色聽, Colored hearing)
          </div>
          <div className="topMessage">
            <div>색청은 소리를 듣고 자동으로 색을 보는 신비한 공감각 현상으로,</div>
            <div>전세계에서 약 4%의 사람들만이 이러한 경험을 한다고 합니다.</div>
          </div>
          <div className="bottomMessage">
            <div>Sound Bubble 은 색청으로부터 영감을 받은 프로젝트입니다.</div>
            <div>여러분이 입력한 소리를 컬러 이미지로 변환하여 제공합니다. </div>
          </div>
         </div>
      </div>
		</>
	);
}

export default LandingSecond;