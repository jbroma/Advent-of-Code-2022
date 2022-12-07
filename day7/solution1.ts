import fs from 'fs';
import path from 'path';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

const lsPattern = /\$\ ls$/;
const cdPattern = /\$\ cd\ (.*)$/;
const dirPattern = /dir.*/;
const filePattern = /(\d+)\ .*$/;

const directories = new Map<string, number>();
const currentDirectories = new Array<string>();

lineReader.on('line', (line: string) => {
    if (line.match(lsPattern) || line.match(dirPattern)) return;
    let match = line.match(cdPattern);
    if (match) {
        if (match![1] == '..') {
            currentDirectories.pop();
        } else {
            currentDirectories.push(match![1]);
        }
    }
    match = line.match(filePattern);
    if (match) {
        for (let i = currentDirectories.length; i > 0; i--) {
            const currentPath = path.join(...currentDirectories.slice(0, i));
            const currentSize = directories.get(currentPath) ?? 0;
            directories.set(currentPath, currentSize + Number(match![1]));
        }
    }
});

lineReader.on('close', () => {
    let sum = 0;
    directories.forEach((size) => {
        if (size <= 100000) {
            sum += size;
        }
    });
    console.log(sum);
});
