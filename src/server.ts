import express from "express";
import type { Request, Response } from "express";
import {pool} from "./db.js";
const app = express();
app.use(express.json());
import type { JobRequesttype } from "./types.js";

app.post("/jobs",async (req: JobRequesttype, res: Response) => {
    const { command, arguments:args } = req.body;   
    const Client = await pool.connect();
    try{
        await Client.query("BEGIN")
        const insertQuery = "INSERT INTO jobs (command,arguments,status) VALUES ($1,$2,$3) RETURNING *"
    const jobupdate = await Client.query(insertQuery,[command,args,"queued"]);
    
    await Client.query("SELECT pg_notify('job_channel','')")
    console.log("NOTIFY")
    await Client.query("COMMIT");
    res.send({
        message: jobupdate.rows
    })} catch(err) { await Client.query("ROLLBACK") ,  res.json(err) } finally {
        Client.release();
    }

})
app.get("/jobs/:id", async (req: Request<{id: string}> , res: Response<{}>) => {

    const id = Number(req.params.id);
    if(id) {try {
        const findquery  = "SELECT * FROM jobs WHERE id = $1" 
        const findjob = await pool.query(findquery,[id]);
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

app.listen((3000) ,async    () => {
    console.log("Server Started")


})