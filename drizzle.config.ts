import "dotenv/config";
import { Config } from "drizzle-kit";

export default {
    schema: "./db/schema.ts",
    out: "./drizzle",
    
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://lingo_owner:lX5YbuphR4IK@ep-billowing-waterfall-a2yuywlq.eu-central-1.aws.neon.tech/lingo?sslmode=require"
    }
} as Config;
