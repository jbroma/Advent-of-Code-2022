import path from 'path';
import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

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
    // Part 1
    let sum = 0;

    directories.forEach((size) => {
        if (size <= 100000) {
            sum += size;
        }
    });

    console.log('PART 1: ', sum);

    // Part 2
    const diskSpaceNeeded = 30000000;
    const diskSpaceCurrentlyFree = 70000000 - directories.get('/')!;
    const diskSpaceToFree = diskSpaceNeeded - diskSpaceCurrentlyFree;

    let smallestDirSize = Infinity;
    for (const size of directories.values()) {
        if (size > diskSpaceToFree && size < smallestDirSize) {
            smallestDirSize = size;
        }
    }

    console.log('PART 2: ', smallestDirSize);
});
