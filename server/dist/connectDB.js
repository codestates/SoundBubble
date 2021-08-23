"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateDB = exports.connectDB = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const readline = __importStar(require("readline"));
//* option
const connectionOptions = {
    development: {
        type: "mysql",
        host: process.env.DATABASE_LOCAL_HOST,
        port: Number(process.env.DATABASE_LOCAL_PORT),
        username: process.env.DATABASE_LOCAL_USERNAME,
        password: process.env.DATABASE_LOCAL_PASSWORD,
        database: process.env.DATABASE_LOCAL_NAME,
        synchronize: true,
        logging: false,
        entities: [__dirname + "/entity/**/*.{ts,js}"],
        migrations: [__dirname + "/migration/**/*.{ts,js}"],
        subscribers: [__dirname + "/subscriber/**/*.{ts,js}"],
        cli: {
            entitiesDir: "entity",
            migrationsDir: "migration",
            subscribersDir: "subscriber",
        },
    },
    production: {
        type: "mysql",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        logging: false,
        entities: [__dirname + "/entity/**/*.{ts,js}"],
        migrations: [__dirname + "/migration/**/*.{ts,js}"],
        subscribers: [__dirname + "/subscriber/**/*.{ts,js}"],
        cli: {
            entitiesDir: "./entity",
            migrationsDir: "./migration",
            subscribersDir: "./subscriber",
        },
    },
};
//* Select option
const env = process.env.NODE_ENV || "development";
const connectionOption = connectionOptions[env];
console.log("Database info:", env);
//* Connect to Database
const connectDB = async () => {
    try {
        const connection = await typeorm_1.createConnection(connectionOption);
        if (process.env.DATABASE_TRUNCATE) {
            console.log("DB Initialization setting...");
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question(`Do you really want to initialize the connected DB? [yes/no] `, async (answer) => {
                switch (answer.toLowerCase()) {
                    case "yes":
                        await exports.truncateDB(connection);
                        console.log("DB Initialization completed");
                        process.exit();
                        break;
                    default:
                        console.log("DB Initialization cancelled");
                        process.exit();
                        break;
                }
            });
        }
    }
    catch (err) {
        console.log("Failed to connect database");
        console.error(err);
    }
};
exports.connectDB = connectDB;
const truncateDB = async (connection) => {
    await connection.dropDatabase();
    await connection.synchronize();
};
exports.truncateDB = truncateDB;
//# sourceMappingURL=connectDB.js.map