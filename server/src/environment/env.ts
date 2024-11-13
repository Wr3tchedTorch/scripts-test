import * as dotenv from "dotenv";

dotenv.config();

const APP_PORT = process.env.APP_PORT;
const NODE_ENV = process.env.NODE_ENV;

export default { APP_PORT, NODE_ENV };