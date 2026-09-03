import pg from "pg";
let wakerworker: (()=> void) | null = null;

export function waitforjob():Promise<void > {
    return new Promise((resolve)=> {
        wakerworker = resolve
    })
}

export async function listner() {
    const Client = new pg.Client({
            connectionString: process.env.CONNECTION_STRING,
    ssl: true
    })  
    await Client.connect();
    await Client.query("LISTEN job_channel")
    Client.on("notification",()=> {
        console.log("Job notified")
        if(wakerworker){
            wakerworker();  
            wakerworker = null;
        }
    })
}