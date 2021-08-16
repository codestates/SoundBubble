import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/./../.env" });
import express from "express";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./connectDB";

import userRouter from "./routes/userRouter";
import bubbleRouter from "./routes/bubbleRouter";

//* Connect DB
connectDB();

const app: express.Application = express();
const PORT: string | number = process.env.SERVER_PORT || 80;

// Setting morgan date
const today: Date = new Date();
const dateFormat: string = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();
morgan.token("date", () => {
  return dateFormat;
});

//* Middleware
app.use(morgan(`"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length] [:date]`));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Route
app.use("/user", userRouter);
app.use("/bubble", bubbleRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!!");
});

// 404 Error Handling
app.use((req: Request, res: Response) => {
  res.status(404).send("Page Not Found!");
});

// Error Handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

//* Listen
app.listen(PORT, () => console.log(`Server is runnning on ${PORT}`));
