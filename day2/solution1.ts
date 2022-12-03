import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt')
});

let score = 0;

const scoring = {
    "AX": 4,
    "AY": 8,
    "AZ": 3,
    "BX": 1,
    "BY": 5,
    "BZ": 9,
    "CX": 7,
    "CY": 2,
    "CZ": 6,
}

type scoringKey = keyof typeof scoring;

lineReader.on('line', (line) => {
    const pair = line.split(" ").join("");
    score += scoring[pair as scoringKey];
});

lineReader.on('close', () => {
    console.log(score);
});