## Dependencies please check package.json 

## start server 
--> npx tsx server.js

## start multiple worker

## Terminal 1
--> npx tsx worker-server.js

## Terminal 2
---> npx tsx worker-server.js

## Terminal 3
---> npx tsx worker-server.js

## For testing 10 concurrent jobs 
## Run 
---> npx tsx test.js

## Problem 

The queue and the worker works fine 
 
I have used NOTIFY and LISTEN in the queue

Both work fine

But whenever there is an job incoming , NOTIFY notfies

but the queue says it's empty everytime , no jobs get executed

but when the restarts happen works perfectly fine 

10 jobs 

Worker 1  ---> 4 jobs

Worker 2 ----> 4 jobs

Worker 3 ----> 2 jobs

No 2 workers claiming the same job

Couldn't able to figure 

## Why the queue is not able to catch the jobs and execute without requiring a restart

PLease don't mind the code quality is sadge 
