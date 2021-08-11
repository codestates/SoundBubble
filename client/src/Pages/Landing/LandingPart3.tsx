import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/LandingPart3.css';
import Piano from '../../Components/Piano/Piano'

const LandingThird = () => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const onScroll = useCallback((): void => {
		setScrollPosition(window.pageYOffset);
  }, []);
  
  useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <>
      <div className="container3">
        <Piano />
      </div>
		</>
	);
}

export default LandingThird;