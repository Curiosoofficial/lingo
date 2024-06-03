import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/neon-http";





const sql = neon("postgresql://lingo_owner:lX5YbuphR4IK@ep-billowing-waterfall-a2yuywlq.eu-central-1.aws.neon.tech/lingo?sslmode=require");

const db = drizzle(sql, {schema})

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses)
    await db.delete(schema.userProgress)

    await db.insert(schema.courses).values([
       {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg"
       },
       {
        id: 2,
        title: "Italian",
        imageSrc: "/it.svg"
       },
       {
        id: 3,
        title: "French",
        imageSrc: "/fr.svg"
       },
       {
        id: 4,
        title: "Croatian",
        imageSrc: "/hr.svg"
       },
    ])

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
}

main();