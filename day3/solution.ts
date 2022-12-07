import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

// Part 1
let sum1 = 0;

lineReader.on('line', (line) => {
    const a = new Set(line.slice(0, line.length / 2));
    const b = new Set(line.slice(line.length / 2));
    a.forEach((letter) => {
        if (b.has(letter)) {
            const charCode = letter.charCodeAt(0);
            if (letter.toLowerCase() === letter) {
                sum1 += charCode - 96;
            } else {
                sum1 += charCode - 64 + 26;
            }
        }
    });
});

// Part 2
let index = 0,
    sum2 = 0;
const sets = new Array<Set<string>>(3);

lineReader.on('line', (line) => {
    sets[index % 3] = new Set(line);
    if (index % 3 === 2) {
        sets[0].forEach((letter) => {
            if (sets[1].has(letter) && sets[2].has(letter)) {
                const charCode = letter.charCodeAt(0);
                if (letter.toLowerCase() === letter) {
                    sum2 += charCode - 96;
                } else {
                    sum2 += charCode - 64 + 26;
                }
            }
        });
    }
    index++;
});

lineReader.on('close', () => {
    console.log('PART 1: ', sum1);
    console.log('PART 2: ', sum2);
});
