import React, { useState } from "react";
import MainPiano from "../Components/MainPage/MainPiano";
import MainMic from "../Components/MainPage/MainMic";
import MainUpload from "../Components/MainPage/MainUpload";
import Error404 from "../Pages/error404";
import Navigation from "../Components/Navigation";

import "./Styles/MainPage.css";
import MainSelectBar from "../Components/MainPage/MainSelectBar";

interface Select {
  select: string;
}

// ? Mode에 따른 컴포넌트 랜더링
function ChoiceMode(props: Select): JSX.Element {
  const { select } = props;
  if (select === "piano") return <MainPiano />;
  else if (select === "mic") return <MainMic />;
  else if (select === "upload") return <MainUpload />;
  else return <Error404 />;
}

const MainPage = () => {
  const [select, setSelect] = useState("piano");
  const handleBtnClick = (e: React.ChangeEvent<HTMLButtonElement>) => {
    setSelect(e.target.classList.value);
  };

  return (
    <>
      <Navigation />
      <div className="main-page">
        <MainSelectBar select={select} handleBtnClick={handleBtnClick} />
        {/* <ChoiceMode select={select} /> */}
        <MainMic />;
      </div>
    </>
  );
};

export default MainPage;
