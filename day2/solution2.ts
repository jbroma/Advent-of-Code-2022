import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt')
});

let score = 0;

const scoring = {
    "AX": 3,
    "AY": 4,
    "AZ": 8,
    "BX": 1,
    "BY": 5,
    "BZ": 9,
    "CX": 2,
    "CY": 6,
    "CZ": 7
}

type scoringKey = keyof typeof scoring;

lineReader.on('line', (line) => {
    const pair = line.split(" ").join("");
    score += scoring[pair as scoringKey];
});

lineReader.on('close', () => {
    console.log(score);
});