"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateDB = exports.connectDB = void 0;
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
const env = process.env.NODE_ENV || "developtment";
const connectionOption = connectionOptions[env];
console.log("Database info: ", env);
//* Connect to Database
const connectDB = async () => {
    try {
        const connection = await typeorm_1.createConnection(connectionOption);
        if (process.env.DATABASE_TRUNCATE) {
            await exports.truncateDB(connection);
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