
    import type { Request } from "express";

    type status = 
    "queued" | "running" | "completed" | "failed";

    export default interface Jobs {
        id: number;
        command: string;
        arguments: string[];
        status: status;
        stdout: "";
        stderr: "";
    }
    export type JobRequesttype = Request<{}, {}, Jobs>;