import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

let containedRanges = 0;

lineReader.on('line', (line) => {
    const [range1, range2] = line.split(',');
    const [range1start, range1end] = range1.split('-').map(Number);
    const [range2start, range2end] = range2.split('-').map(Number);

    if (
        (range1start <= range2start && range1end >= range2end) ||
        (range2start <= range1start && range2end >= range1end)
    ) {
        containedRanges += 1;
    }
});

lineReader.on('close', () => {
    console.log(containedRanges);
});
