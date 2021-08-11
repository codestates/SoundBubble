import Footer from "../Components/Footer";
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MyPalettes from '../Components/Mypage/MyPalettes'
import Nickname from '../Components/Mypage/Nickname';
import Password from '../Components/Mypage/Password';
import './Styles/Mypage.css';

const Mypage = () => {
  return (
    <>
      <div className="mypageContainer">
      <div className="leftContents">
      <div className="mypageTitle"> My page </div>
      <div className="userImg"></div>
      <div className="userId"></div>
      <div className="sideTap">
        <div className="tap">닉네임 변경</div>
        <div className="tap">비밀번호 변경</div>
        <div className="tap">나의 팔레트</div>
      </div>
          </div>
        <div className="rightContents">
          
      </div>
    </div>
    <Footer/>
    </> 
  )
};

export default Mypage;