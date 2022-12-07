import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

// Part 1
let current = 0,
    highest = 0;

lineReader.on('line', (line) => {
    if (!line) {
        if (current > highest) {
            highest = current;
        }
        current = 0;
    } else {
        current += Number(line);
    }
});

// Part 2
let index = 0,
    results = [0];

lineReader.on('line', (line) => {
    if (!line) {
        index += 1;
        results[index] = 0;
    } else {
        results[index] += Number(line);
    }
});

lineReader.on('close', () => {
    console.log('PART 1: ', highest);

    results.sort((a, b) => b - a);
    console.log('PART 2: ', results[0] + results[1] + results[2]);
});
