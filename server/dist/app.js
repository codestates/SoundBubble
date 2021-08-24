"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/./../.env" });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const connectDB_1 = require("./connectDB");
const error_1 = require("./error");
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const bubbleRouter_1 = __importDefault(require("./routes/bubbleRouter"));
//* Express App
const app = express_1.default();
//* Middleware
const morganFormat = `"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length]`;
app.use(morgan_1.default(morganFormat, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skip: (req, res) => {
        if (req.originalUrl === "/")
            return true;
        return false;
    },
}));
app.use(cors_1.default({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//* Route
app.use("/user", userRouter_1.default);
app.use("/bubble", bubbleRouter_1.default);
app.get("/", (req, res) => {
    res.send("Hello world!!");
});
// 404 Error Handling
app.use((req, res) => {
    res.status(404).send("Page Not Found!");
});
// Error Handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    if (err instanceof error_1.FileTypeError) {
        return res.status(400).send(err.message);
    }
    res.status(500).send("Internal Server Error");
});
//* Connect DB
connectDB_1.connectDB();
exports.default = app;
//# sourceMappingURL=app.js.map