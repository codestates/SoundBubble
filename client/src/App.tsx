import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducerType } from './Store'
import { increaseNumber, decreaseNumber } from './actions/index'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

const numberReducer = useSelector((state:RootReducerType) => state.numberReducer)
  const dispatch = useDispatch();
  

  const changeNum = (event: any) => {
    if(event.target.innerText === '-') dispatch(decreaseNumber())
    if(event.target.innerText === '+') dispatch(increaseNumber())
  }
  
  return (
    <>
      <div className='main'>
        <h1>{numberReducer.num}</h1>
      <button onClick={changeNum}>-</button>
      <button onClick={changeNum}>+</button>
      </div>
    </>
  );
}

export default App;
