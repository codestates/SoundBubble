"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entity/User");
const validate_1 = require("../../utils/validate");
const log_1 = require("../../utils/log");
const checkEmail = async (req, res, next) => {
    const email = req.body.email;
    try {
        //* 파라미터 검사
        if (!email || !validate_1.checkEmailFormat(email)) {
            return res.status(400).json({ message: `Invalid email(body), input 'email': ${email}` });
        }
        const maybeUser = await User_1.User.findOne({ where: { email: email } });
        if (maybeUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(200).json({ message: "Available email" });
    }
    catch (err) {
        log_1.logError("Failed to check email");
        next(err);
    }
};
exports.default = checkEmail;
//# sourceMappingURL=checkEmail.js.map