    import exectuejob from "./executor.js";
    import { wakeupcall } from "../server.js";
    import { pgClient } from "../db/db.js";
    export default async function worker() {
        while (true) {
            const selectquery = "SELECT * FROM jobs WHERE status = $1 "
            const jobqueue = await pgClient.query(selectquery,['queued']); 
            console.log();
            if (jobqueue.rowCount === 0) {
                console.log("Queue empty. Worker going to sleep...");
                await wakeupcall();
                console.log("Worker woke up! Checking for new jobs...");
                continue;
            }
            const concurrent = jobqueue.rows;
            const updatequery = "UPDATE jobs SET status = $1 WHERE id = $2 SKIP LOCKED "
            for (const job of concurrent) {
                await pgClient.query( updatequery , ["running" , job.id]);
            }
    
            await Promise.all(concurrent.map((job) => exectuejob(job)));
        }
    }
    
    