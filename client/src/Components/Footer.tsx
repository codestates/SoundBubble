import React from "react";
import "./Styles/Footer.css";
import githubIcon from "../Static/icons/footerIcon1.png";
import instagramIcon from "../Static/icons/footerIcon2.png";

const Footer = (): JSX.Element => {
	return (
		<div className="footerContainer">
			<div className="footerWrap">
				<a href="" className="logo">
					<img className="nav-logo" src="logo_w.png" alt="logo" />
				</a>
				<div className="aboutUs">
					<h3>About Us</h3>
					<a href="https://github.com/codestates/SoundBubble/wiki" target="_blank" rel="noreferrer">
						<p>Wiki</p>
					</a>
					<a href="https://github.com/codestates/SoundBubble/tree/master/client" target="_blank" rel="noreferrer">
						<p>Client</p>
					</a>
					<a href="https://github.com/codestates/SoundBubble/tree/master/server" target="_blank" rel="noreferrer">
						<p>Server</p>
					</a>
				</div>
				<div className="contact">
					<h3>Contact</h3>
					<a href="https://github.com/jeongbeen2" target="_blank" rel="noreferrer">
						<p>Jeongbeen Kim</p>
					</a>
					<a href="https://github.com/jeyoon2" target="_blank" rel="noreferrer">
						<p>Jeyoon Jeong</p>
					</a>
					<a href="https://github.com/OhDaky" target="_blank" rel="noreferrer">
						<p>Dakyeong Oh</p>
					</a>
					<a href="https://github.com/idenk" target="_blank" rel="noreferrer">
						<p>Jaewoo Kim</p>
					</a>
				</div>
				<div className="iconWrap">
					<a href="https://github.com/codestates/SoundBubble" target="_blank" rel="noreferrer">
						<img src={githubIcon} width="40px"></img>
					</a>
					<a href="http://www.instagram.com/soundbubble_official/" target="_blank" rel="noreferrer">
						<img src={instagramIcon} width="40px"></img>
					</a>
				</div>
			</div>
			<p className="copyRight">© Copyright 2021 SoundBubble Inc. All rights reserved.</p>
		</div>
	);
};

export default Footer;
