import { parentPort, workerData } from "node:worker_threads";

const { numbers } = workerData;

let count = 0n;

for (const number of numbers) {
    count += BigInt(number);
}

parentPort.postMessage(count.toString());