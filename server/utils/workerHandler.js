import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runWorkerTask = (task, data) => {
    return new Promise((resolve, reject) => {
        const workerPath = path.resolve(__dirname, "../workers/mainWorker.js");
        const worker = new Worker(workerPath, {
            workerData: { task, data },
            type: "module" // Required for ESM imports in worker
        });

        worker.on("message", (result) => {
            if (result.error) {
                reject(new Error(result.error));
            } else {
                resolve(result.data);
            }
        });

        worker.on("error", reject);

        worker.on("exit", (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};
