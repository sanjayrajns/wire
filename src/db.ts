import pg from "pg"
export const pool = new pg.Pool({
    connectionString: "postgresql://neondb_owner:npg_auQY7giXLV2R@ep-autumn-snow-ay6t15dm-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: true
}) ;


