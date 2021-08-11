"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
//* option
const connectionOptions = {
    developtment: {
        type: "mysql",
        host: process.env.DATABASE_LOCAL_HOST,
        port: Number(process.env.DATABASE_LOCAL_PORT),
        username: process.env.DATABASE_LOCAL_USERNAME,
        password: process.env.DATABASE_LOCAL_PASSWORD,
        database: process.env.DATABASE_LOCAL_NAME,
        synchronize: true,
        logging: true,
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
const env = process.env.NODE_ENV || "developtment";
const connectionOption = connectionOptions[env];
console.log("Database info: ", env);
//* Connect to Database
const connectDB = async () => {
    await typeorm_1.createConnection(connectionOption)
        .then(async (connection) => {
        console.log("Database connected");
        // await connection.dropDatabase();
        // await connection.synchronize();
    })
        .catch((error) => {
        console.log("Failed to connect database");
        console.log(error);
    });
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=connectDB.js.map