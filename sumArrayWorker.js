import { parentPort, workerData } from "node:worker_threads";

const { part, array } = workerData;

let count = 0;

const sharedArray = new Int32Array(array);

for (let i = part[0]; i < part[1]; i++) {
    count += sharedArray[i];
}

parentPort.postMessage(count);