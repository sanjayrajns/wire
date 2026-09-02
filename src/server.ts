import express from "express";
import type { Request, Response } from "express";
import type Jobs from "./types.js";
import worker from "./jobs/worker.js";
import { pgClient } from "./db/db.js";
const app = express();
app.use(express.json());


type JobRequesttype = Request<{}, {}, Jobs>;

function triggerfunction(){
    if(wakerworker){
        wakerworker();
        wakerworker = null;
    }
}


app.post("/jobs",async (req: JobRequesttype, res: Response) => {
    const { id, command, arguments:args } = req.body;
    try{const insertQuery = "INSERT INTO jobs (id,command,arguments,status) VALUES ($1,$2,$3,$4) RETURNING *"
    const jobupdate = await pgClient.query(insertQuery,[id,command,args,"queued"]);
    console.log(jobupdate.rows);

    res.send({
        message: jobupdate.rows
    })} catch(err) {res.json(err)}
    
    console.log("Putting into the queue");
    triggerfunction();

})
app.get("/jobs/:id", async (req: Request<{id: string}> , res: Response<{}>) => {

    const id = Number(req.params.id);
    if(id) {try {
        const findquery  = "SELECT * FROM jobs WHERE id = $1" 
        const findjob = await pgClient.query(findquery,[id]);
        console.log(findjob.rows);
        res.json({
            message: findjob.rows
        })
    } catch (err) {
        res.json({
            message: "Error Job Not found",
            error: err
        })
    }} else {res.json("Please enter a valid job sequence number")}
    
})

let wakerworker: (()=> void  ) | null = null;

export function wakeupcall() : Promise<void> {
    return new Promise((resolve)=> {
        wakerworker = resolve
    })
}

async function retryjobs() {
    const sertquery = "UPDATE jobs SET status = $1 WHERE status = $2";
    await pgClient.query(sertquery,["queued" , "running"]);
}

app.listen(3001 , async () => {
    await retryjobs();
    worker();
});



