"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNicknameFormat = exports.checkPasswordFormat = exports.checkEmailFormat = void 0;
const checkEmailFormat = (email) => {
    // 이메일 형식 체크
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regExp.test(email))
        return true;
    return false;
};
exports.checkEmailFormat = checkEmailFormat;
const checkPasswordFormat = (password) => {
    // 비밀번호 형식 체크
    // 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 가능)
    const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
    if (regExp.test(password))
        return true;
    return false;
};
exports.checkPasswordFormat = checkPasswordFormat;
const checkNicknameFormat = (nickname) => {
    // 닉네임 형식 체크
    // 최대 30자
    const regExp = /^.{1,30}$/;
    if (regExp.test(nickname))
        return true;
    return false;
};
exports.checkNicknameFormat = checkNicknameFormat;
//# sourceMappingURL=validate.js.map