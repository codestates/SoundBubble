import React from "react";
import "./Styles/error404.css"

const error404 = (): JSX.Element => {
	//! 주소 바꾸기
	function goPalette(e) {
		window.location.href = 'http://localhost:3000/palette';
	}
	function goMain(e) {
		window.location.href = 'http://localhost:3000/main';
	}
	
	return (
		<div className="errorWrapper">
			<div className="errorMessage">
				<div className="error404">404</div>
				<div className="page">잘못된 주소입니다!</div>
				<div className="page">아래 페이지로 이동하세요</div>
			</div>
			<div className="error-btnWrap">
				<button className="btn-go palette" onClick={goPalette}>팔레트 구경가기</button>
				<button className="btn-go main" onClick={goMain}>체험하러 가기</button>
			</div>
		</div>
	);
};

export default error404;
