import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

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
            console.log(i);
            break;
        }
    }
});
