"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const PORT = process.env.SERVER_PORT || 80;
// Setting morgan date
const today = new Date();
const dateFormat = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();
morgan_1.default.token("date", () => {
    return dateFormat;
});
app.use(morgan_1.default(`"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length] [:date]`));
app.use(cors_1.default({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello world!!");
});
app.listen(PORT, () => console.log(`http server is runnning on ${PORT}`));
//# sourceMappingURL=app.js.map