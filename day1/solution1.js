import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt')
});

let current = 0, highest = 0;

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

lineReader.on('close', () => {
    console.log(highest)
});