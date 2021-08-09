export const INCREASE_NUMBER = "INCREASE_NUMBER";
export const DECREASE_NUMBER = "DECREASE_NUMBER";

export const increaseNumber = () => {
  return {
    type: INCREASE_NUMBER,
  };
};
export const decreaseNumber = () => {
  return {
    type: DECREASE_NUMBER,
  };
};
