import fs from 'fs';
import path from 'path';
import readline from 'readline';

export const initLineReader = (
    dir: string,
    filename: string = 'inputs.txt'
) => {
    return readline.createInterface({
        input: fs.createReadStream(path.join(dir, filename)),
    });
};

export const parseFile = async (
    dir: string,
    filename: string = 'inputs.txt'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const lineReader = initLineReader(dir, filename);
            const lines: string[] = [];

            lineReader.on('line', (line) => lines.push(line));
            lineReader.on('close', () => resolve(lines.join('\n')));
        } catch (error) {
            reject(`Error when reading file ${path.join(dir, filename)}`);
        }
    });
};
