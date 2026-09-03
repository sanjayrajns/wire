import pg from "pg"
export const pool = new pg.Pool({
    connectionString:process.env.CONNECTION_STRING,
    ssl: true
}) ;


