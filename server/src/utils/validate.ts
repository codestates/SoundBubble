export const checkEmailFormat = (email: string): boolean => {
  // 이메일 형식 체크
  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (regExp.test(email)) return true;
  return false;
};

export const checkPasswordFormat = (password: string): boolean => {
  // 비밀번호 형식 체크
  // 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 가능)
  const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
  if (regExp.test(password)) return true;
  return false;
};
