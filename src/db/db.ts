
import { Client } from "pg";


export const pgClient = new Client({
    connectionString: process.env.CONNECTION_STRING,
    ssl: true
});
async function connect(){
    try {
        await pgClient.connect();
    } catch {
        console.log("Failed to connect to the database")
    }
}

connect(); 

