const requests = Array.from({ length: 10 }, (_, i) =>
    fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            command: "echo",
            arguments: ["test-job.js", String(i)]
        })
    })
);

const responses = await Promise.all(requests);

for (const response of responses) {
    console.log(
        response.status,
        await response.text()
    );
}

console.log(`Submitted ${responses.length} jobs`);