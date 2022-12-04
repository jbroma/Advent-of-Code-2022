import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

let index = 0,
    sum = 0;
const sets = new Array<Set<string>>(3);

lineReader.on('line', (line) => {
    sets[index % 3] = new Set(line);
    if (index % 3 === 2) {
        sets[0].forEach((letter) => {
            if (sets[1].has(letter) && sets[2].has(letter)) {
                const charCode = letter.charCodeAt(0);
                if (letter.toLowerCase() === letter) {
                    sum += charCode - 96;
                } else {
                    sum += charCode - 64 + 26;
                }
            }
        });
    }
    index++;
});

lineReader.on('close', () => {
    console.log(sum);
});
