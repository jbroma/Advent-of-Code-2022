import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

// Part 1
lineReader.on('line', (line: string) => {
    for (let i = 4; i < line.length; i++) {
        if (new Set(line.slice(i - 4, i)).size === 4) {
            console.log('PART 1: ', i);
            break;
        }
    }
});

// Part 2
let startDetected = false;
lineReader.on('line', (line: string) => {
    for (let i = 4; i < line.length; i++) {
        if (new Set(line.slice(i - 4, i)).size === 4) {
            startDetected = true;
        }
        if (
            i >= 14 &&
            startDetected &&
            new Set(line.slice(i - 14, i)).size === 14
        ) {
            console.log('PART 2: ', i);
            break;
        }
    }
});
