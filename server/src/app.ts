import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });
import express from "express";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./connectDB";
import { FileTypeError } from "./error";
import fs from "fs";
import https from "https";

import userRouter from "./routes/userRouter";
import bubbleRouter from "./routes/bubbleRouter";

//* Express Instance
const app: express.Application = express();
const PORT: number = Number(process.env.SERVER_PORT) || 80;

//* Middleware
const morganFormat = `"HTTP/:http-version :method :url" :status :remote-addr - :remote-user :res[content-length]`;
app.use(
	morgan(morganFormat, {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		skip: (req: Request, res: Response) => {
			if (req.originalUrl === "/") return true;
			return false;
		},
	}),
);
app.use(
	cors({
		origin: ["https://www.soundbubble.io"],
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	}),
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	if (err instanceof FileTypeError) {
		return res.status(400).send(err.message);
	}
	res.status(500).send("Internal Server Error");
});

//* Connect DB and Server listen
connectDB(() => {
	if (process.env.NODE_ENV !== "production" && fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
		//? HTTPS: for CORS and cookie test in local
		const privateKey = fs.readFileSync(__dirname + "/../key.pem", "utf8");
		const certificate = fs.readFileSync(__dirname + "/../cert.pem", "utf8");
		const credentials = { key: privateKey, cert: certificate };

		const server: https.Server = https.createServer(credentials, app);
		server.listen(PORT, () => console.log(`HTTPS server is runnning on ${PORT}`));
	} else {
		app.listen(PORT, () => console.log(`HTTP server is runnning on ${PORT}`));
	}
});
