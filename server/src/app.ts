import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.SERVER_PORT || 80;

// Setting morgan date
const today = new Date();
const dateFormat = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();
morgan.token("date", () => {
  return dateFormat;
});

app.use(morgan(`"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length] [:date]`));
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello world!!");
});

app.listen(PORT, () => console.log(`http server is runnning on ${PORT}`));
