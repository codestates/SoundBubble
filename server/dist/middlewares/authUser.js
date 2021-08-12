"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserInfo_1 = __importDefault(require("./getUserInfo"));
const authUser = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Token does not exist" });
    }
    const accessToken = authorization.split("Bearer ")[1];
    if (!accessToken) {
        return res.status(401).json({ message: "Token does not exist" });
    }
    const userInfo = await getUserInfo_1.default(res, accessToken);
    if (userInfo.error) {
        if (userInfo.error === "EXPIRED") {
            return res.status(403).json({ message: "Expired token" });
        }
        else if (userInfo.error === "INVALID") {
            return res.status(403).json({ message: "Invalid token" });
        }
        else if (userInfo.error === "SERVER") {
            return res.status(500).json({ message: "Server error" });
        }
    }
    const { userId, email, accountType } = userInfo;
    if (!userId || !email || !accountType) {
        return res.status(403).json({ message: "Invalid token" });
    }
    req.userInfo = userInfo;
    next();
};
exports.default = authUser;
//# sourceMappingURL=authUser.js.map