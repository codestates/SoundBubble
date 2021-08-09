import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";

type DatabaseOptions = {
  [env: string]: ConnectionOptions;
};
//* option
const connectionOptions: DatabaseOptions = {
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
const env: string = process.env.NODE_ENV || "developtment";

const connectionOption: ConnectionOptions = connectionOptions[env];
console.log("Database info: ", env);

//* Connect to Database
export const connectDB = async () => {
  await createConnection(connectionOption)
    .then(async () => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Failed to connect database");
      console.log(error);
    });
};

export default connectDB;
