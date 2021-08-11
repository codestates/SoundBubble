module.exports = {
  emailIsValid: (email) => {
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regExp.test(email)) return true;
    return false;
  },
  pwIsValid: (pw) => {
    // ? # 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 불가능)
    const regExp1 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    // ? # 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 가능)
    const regExp2 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
    // ? # 8-16자 영문, 숫자, 특수문자 반드시 1개 포함
    const regExp3 =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;

    if (regExp2.test(pw)) return true;
    return false;
  },
};
