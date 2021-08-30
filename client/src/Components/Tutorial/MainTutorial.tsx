import React, { useState, useEffect, useRef } from "react";
import "../Styles/MainTutorial.css";

interface Props {
	handleCloseTutorial: () => void;
	checkboxOption?: boolean;
}

const MainTutorial = ({ handleCloseTutorial, checkboxOption }: Props): JSX.Element => {
	const [tutorialIdx, setTutorialIdx] = useState<number>(1);
	const [checked, setChecked] = useState<boolean>(false);

	const carouselList = useRef<HTMLUListElement>(null);

	useEffect(() => {
		console.log("translateX", 100 - tutorialIdx * 100);
		carouselList.current?.style.setProperty("transform", `translateX(${100 - tutorialIdx * 100}%)`);
	}, [tutorialIdx]);

	const handleMoveToPrev = () => {
		if (tutorialIdx > 1) {
			setTutorialIdx(tutorialIdx - 1);
		}
	};
	const handleMoveToNext = () => {
		const itemLen = carouselList.current?.childNodes.length as number;
		if (tutorialIdx < itemLen) {
			setTutorialIdx(tutorialIdx + 1);
		}
	};

	const handleShowToggle = event => {
		setChecked(!checked);
		localStorage.setItem("showTutorial", String(!event.target.checked));
		console.log("showTutorial", localStorage.getItem("showTutorial"));
	};

	return (
		<>
			<div className="tutorial-modal-background">
				<main className="tutorial-modal-box">
					<div className="tutorial-modal-top-bar">
						<div className="tutorial-btn-box">
							<button className="tutorial-close-btn" onClick={handleCloseTutorial}>
								𝗫
							</button>
						</div>
					</div>
					<div className="tutorial-modal-content">
						<div className="tutorial-modal-btn" onClick={handleMoveToPrev}>◀︎</div>
						<div className="tutorial-modal-body">
							<ul className="tutorial-modal-list" ref={carouselList}>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/1-1.png" alt="tutorial1" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/1-2.png" alt="tutorial2" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/1-3.png" alt="tutorial3" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/2-1.png" alt="tutorial4" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/2-2.png" alt="tutorial5" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/2-3.png" alt="tutorial6" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/3-1.png" alt="tutorial7" />
								</li>
								<li className="tutorial-modal-item">
									<img src="/images/tutorial/4-1.png" alt="tutorial8" />
								</li>
							</ul>
						</div>
						<div className="tutorial-modal-btn" onClick={handleMoveToNext}>▶︎</div>
					</div>
					{checkboxOption ? (
						<div className="tutorial-modal-footer">
							<input type="checkbox" checked={checked} onChange={handleShowToggle} />
							다시 열지 않기
						</div>
					) : (
						""
					)}
				</main>
			</div>
		</>
	);
};

export default MainTutorial;
