import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

let containedRanges = 0;
let overlappingRanges = 0;

lineReader.on('line', (line) => {
    const [range1, range2] = line.split(',');
    const [range1start, range1end] = range1.split('-').map(Number);
    const [range2start, range2end] = range2.split('-').map(Number);

    // Part 1
    if (
        (range1start <= range2start && range1end >= range2end) ||
        (range2start <= range1start && range2end >= range1end)
    ) {
        containedRanges += 1;
    }

    // Part 2
    if (
        (range1start >= range2start && range1start <= range2end) ||
        (range1end >= range2start && range1end <= range2end) ||
        (range2start >= range1start && range2start <= range1end) ||
        (range2end >= range1start && range2end <= range1end)
    ) {
        overlappingRanges += 1;
    }
});

lineReader.on('close', () => {
    console.log('PART 1: ', containedRanges);
    console.log('PART 2: ', overlappingRanges);
});
