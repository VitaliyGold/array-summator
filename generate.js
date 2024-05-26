function generateRandomArray(size, minValue = 1, maxValue = 2000) {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }
    return array;
};

export {
    generateRandomArray,
}