
import { useState } from "react";
import axios from "axios";
import { increaseNumber, decreaseNumber } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { RootReducerType } from "../Store";

export default function Test() {
  const numberReducer = useSelector(
    (state: RootReducerType) => state.numberReducer
  );
  const dispatch = useDispatch();

  const changeNum = (event: any) => {
    if (event.target.innerText === "-") dispatch(decreaseNumber());
    if (event.target.innerText === "+") dispatch(increaseNumber());
  };


  let [hello, setHello] = useState("");
  let bubbleURL = process.env.REACT_APP_API_URL;
  axios({
    method: "get",
    url: `${bubbleURL}`,
    withCredentials: true,
  }).then((resp) => setHello(resp.data));

  return (
    <div className="main">
      <h1>
        {numberReducer.num} people say, {hello}
      </h1>
      <button onClick={changeNum}>-</button>
      <button onClick={changeNum}>+</button>
    </div>
  );
}
