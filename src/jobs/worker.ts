import exectuejob from "./executor.js";
import { waitforjob } from "./notifier.js";
import { pool } from "../db.js";

export  async function claimwork() {
    const client = await pool.connect();
        try {
            await client.query("BEGIN")
            const selectquery = "SELECT * FROM jobs WHERE status = $1 ORDER BY id LIMIT 2 FOR UPDATE SKIP LOCKED "
            const jobqueue = await client.query(selectquery, ['queued']);
            const concurrent = jobqueue.rows;
            if (concurrent.length === 0) {
                await client.query("COMMIT");
                return [];
            }
            const updatequery = "UPDATE jobs SET status = $1 WHERE id = $2"
            for (const job of concurrent) {
                await client.query(updatequery, ["running", job.id]);
            }
            console.log("running");
            await client.query("COMMIT")
            return concurrent;
        } catch (error) {
            await client.query("ROLLBACK")
            throw error;
        } finally {client.release()}
    } 

export default async function worker() {
    while(true) {
        const jobs = await claimwork();
        if(!jobs || jobs.length === 0){
            console.log("Queue Empty");
            await waitforjob();
            console.log("Queue busy.........")
            continue;
        }
        await Promise.all(jobs.map((job) => exectuejob(job)));
    }
} 
