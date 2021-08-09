import { INCREASE_NUMBER, DECREASE_NUMBER } from "../actions/index";

interface InitialState {
  num: number;
}

const initialState: InitialState = {
  num: 0,
};

const numberReducer = (state = initialState, action: any): InitialState => {
  switch (action.type) {
    case INCREASE_NUMBER:
      return { num: state.num + 1 };
    case DECREASE_NUMBER:
      return { num: state.num - 1 };
    default:
      return state;
  }
};

export default numberReducer;
