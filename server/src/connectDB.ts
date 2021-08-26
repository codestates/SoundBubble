import "reflect-metadata";
import { createConnection, ConnectionOptions, Connection } from "typeorm";
import * as readline from "readline";

type DatabaseOptions = {
	[env: string]: ConnectionOptions;
};
//* option
const connectionOptions: DatabaseOptions = {
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
const env: string = process.env.NODE_ENV || "development";

const connectionOption: ConnectionOptions = connectionOptions[env];
console.log("Database info:", env);

//* Connect to Database
export const connectDB = async (): Promise<void> => {
	try {
		const connection: Connection = await createConnection(connectionOption);
		if (process.env.DATABASE_TRUNCATE) {
			//* DB init
			console.log("DB Initialization setting...");
			const rl: readline.Interface = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			rl.question(`Do you really want to initialize the connected DB? [yes/no] `, async answer => {
				switch (answer.toLowerCase()) {
					case "yes":
						await truncateDB(connection);
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
	} catch (err) {
		console.log("Failed to connect database");
		console.error(err);
	}
};

export const truncateDB = async (connection: Connection): Promise<void> => {
	await connection.dropDatabase();
	await connection.synchronize();
};
