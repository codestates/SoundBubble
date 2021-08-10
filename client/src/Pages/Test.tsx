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

  return (
    <div className="main">
      <h1>{numberReducer.num}</h1>
      <button onClick={changeNum}>-</button>
      <button onClick={changeNum}>+</button>
    </div>
  );
}
