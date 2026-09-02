import cp from "node:child_process";
import { pgClient } from "../db/db.js";
import type Jobs from "../types.js";

export default function exectuejob(job: Jobs): Promise<void> {
    let stdout = "";
    let stderr = "";
    return new Promise((resolve, reject) => {
        const child = cp.spawn(job.command, job.arguments);

        child.stdout.on("data",  (data) => {
            const output = data.toString();
            stdout += output;
        });

        child.stderr.on("data", (data) => {
            const output = data.toString();
            stderr += output;
        });

        child.on("error", async (error) => {
            const failedquery = "UPDATE jobs SET status = $1 WHERE id = $2";
            await pgClient.query(failedquery,["failed" , job.id] );
            resolve();
        });
        child.on("close",async (code) => {
            if (code === 0) {
                const updatequery = "UPDATE jobs SET stdout = $1 , stderr = $2 , status = $3 , exit_code = $4 WHERE id = $5  COMMUT"
                await pgClient.query(updatequery,[stdout,stderr,"success",code , job.id]);
                console.log("Process Completed", code);
                resolve();
            } else {
                const updatstatus = "UPDATE jobs SET status = $1 WHERE id = $2 "
                  await pgClient.query(updatstatus,["failed",job.id]);
                  console.log("Process Failed",code)
                resolve();
            }
        });
    });
}
