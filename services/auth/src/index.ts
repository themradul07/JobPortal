import app from "./app.js";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import { createClient } from "redis";

dotenv.config();

export const redisClient = createClient({
    url: process.env.Redis_url as string
})

redisClient.connect().then(() => {
    console.log("Redis connected successfully");
}).catch((error) => {
    console.log("Error while connecting to redis", error);
})

async function initDb() {
    try {
        await sql`
        DO $$
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='user_role') THEN
                CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
            END IF;
        END $$;
        `

        await sql`
        CREATE TABLE IF NOT EXISTS users (
           user_id SERIAL PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           email VARCHAR(255) NOT NULL UNIQUE,
           password VARCHAR(255) NOT NULL,
           phone_number VARCHAR(20) NOT NULL,
           role user_role NOT NULL,
           bio TEXT,
           resume VARCHAR(255),
           resume_public_id VARCHAR(255),
           profile_pic VARCHAR(255),
           subscription VARCHAR(255),
           profile_pic_public_id VARCHAR(255),
           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        `

        await sql`
        CREATE TABLE IF NOT EXISTS skills(
           skill_id SERIAL PRIMARY KEY,
           name VARCHAR(255) NOT NULL UNIQUE
        );
        `
        await sql`
        CREATE TABLE IF NOT EXISTS user_skills(
           user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
           skill_id INT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
           PRIMARY KEY (user_id, skill_id)
        );  
        `

        console.log("Connected Successfully");
    } catch (e) {
        console.log("Error while connecting", e);
        process.exit(1);
    }
}

initDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Auth services is running on http://localhost:${process.env.PORT}`)
    })

})
