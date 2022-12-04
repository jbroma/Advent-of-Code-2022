import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

let sum = 0;

lineReader.on('line', (line) => {
    const a = new Set(line.slice(0, line.length / 2));
    const b = new Set(line.slice(line.length / 2));
    a.forEach((letter) => {
        if (b.has(letter)) {
            const charCode = letter.charCodeAt(0);
            if (letter.toLowerCase() === letter) {
                sum += charCode - 96;
            } else {
                sum += charCode - 64 + 26;
            }
        }
    });
});

lineReader.on('close', () => {
    console.log(sum);
});
