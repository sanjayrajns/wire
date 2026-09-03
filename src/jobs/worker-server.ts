import worker from "./worker.js";
import { listner } from "./notifier.js";

await listner();
console.log("Worker Stared")
worker().catch(error => {
    console.error("Worker crashed:", error);
    process.exit(1);
});