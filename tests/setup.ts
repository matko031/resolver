import { config as DotEnvConfig } from "dotenv";
import path from "path";

const env_path = path.resolve(__dirname, '..', ".env.test");
DotEnvConfig({ path: env_path });
