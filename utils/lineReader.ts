import fs from 'fs';
import path from 'path';
import readline from 'readline';

export const initLineReader = (dir: string) => {
    return readline.createInterface({
        input: fs.createReadStream(path.join(dir, 'inputs.txt')),
    });
};
