import path from 'node:path';
import { Worker } from 'node:worker_threads';

import { generateRandomArray } from './generate.js';

function splitArray(length, n) {
    const partSize = Math.ceil(length / n);
    const parts = [];
    for (let i = 0; i < n; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, length);
        parts.push([start, end]);
    }
    return parts;
}

async function parallelSum(array, concurrentlyCount = 1) {
    if (concurrentlyCount <= 0 || concurrentlyCount > 5) {
        throw new Error('Количество воркеров должно быть от 1 до 5');
    }
    if (!array || array.length > 1000000) {
        throw new Error('Количество элементов в массиве должно быть от 1 до 1000000');
    }

    const start = Date.now();
    const workersList = [];

    const partOfArray = splitArray(array.length, concurrentlyCount);

    const sharedArray = new Int32Array(array);

    for (let i = 0; i < concurrentlyCount; i++) {
        workersList.push(new Promise(resolve => {
            const worker = new Worker(path.resolve('sumArrayWorker.js'), {
                workerData: {
                    part: partOfArray[i],
                    array: sharedArray.buffer,
                },
            })
            worker.on('message', (sum) => resolve(sum));
            worker.on('error', (err) => {
                throw new Error(err)
            })
        }))
    }

    const workerSumm = await Promise.all(workersList);

    const finalSumm = await new Promise(resolve => {
        const worker = new Worker(path.resolve('sumBigInt.js'), {
            workerData: {
                numbers: workerSumm,
            },
        })
        worker.on('message', (sum) => resolve(sum));
    })

    const end = Date.now()
    return {
        count: finalSumm,
        time: end - start,
    };
}


export {
    parallelSum,
}

const testArray = generateRandomArray(1000000, 2000000000, 2000000000);

const result = await parallelSum(testArray, 5);

console.log('array sum - ' + result.count);
console.log('working time - ' + result.time);
