import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

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
    results.sort((a, b) => b - a);
    console.log(results[0] + results[1] + results[2]);
});
