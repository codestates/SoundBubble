import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart1.css';
import { IoIosArrowUp } from 'react-icons/io';

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
        <div className="toTopBtnWrapper" style={{
							opacity: `${scrollPosition > 100 ? `1` : `0`}`,
							color: `${
								(scrollPosition > 100 && scrollPosition < 2530) ||
								(scrollPosition > 6680 && scrollPosition < 10330) ||
								scrollPosition > 11375
									? `#fff`
									: `#000`
							}`,
							transition: '0.3s',
						}}
						onClick={(): void => {
							if (BackToTopRef.current) {
								BackToTopRef.current.scrollIntoView({
									behavior: 'smooth',
								});
							}
          }}>
          <button className="toTopBtn">
            <IoIosArrowUp className="toTopIcon"/>
          </button>
        </div>
        <div className="contentsWrapper">
          <div className="mainMessage">당신의 소리는 어떤 색인가요?</div>
          <div className="subMessage">나만의 Sound Bubble을 만들어보세요</div>
          <button className="freeExpBtn">
								<p>빠른 시작</p>
					</button>
        </div>
      </div>
		</>
	);
}

export default LandingFirst;