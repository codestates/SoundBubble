import React from "react";
import './Styles/Footer.css';

const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="contentsWrapper">
        <div className="aboutUs">
          <a href="https://github.com/jeongbeen2" target="blank">Jeongbeen Kim</a>
          <a href="https://github.com/jeyoon2" target="blank">Jeyoon Jeong</a>
          <a href="https://github.com/OhDaky" target="blank">Dakyeong Oh</a>
          <a href="https://github.com/idenk" target="blank">Jaewoo Kim</a>
        </div>
      </div>
      <div className="copyright">
        © Copyright 2021 SoundBubble Inc. All rights reserved.
      </div>
    </div>
  )
};

export default Footer;
