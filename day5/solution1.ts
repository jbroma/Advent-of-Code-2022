import fs from 'fs';
import readline from 'readline';

const lineReader = readline.createInterface({
    input: fs.createReadStream('inputs.txt'),
});

const stacks = Array.from({ length: 9 }, (_) => new Array());

function assembleStack(line: string) {
    for (let i = 0, j = 1; i < 9; i++, j += 4) {
        if (line[j] !== ' ') {
            stacks[i].push(line[j]);
        }
    }
}

const movePattern = new RegExp(/move\s(\d+)\sfrom\s(\d)\sto\s(\d)/);

lineReader.on('line', (line: string) => {
    if (line.startsWith('[')) {
        assembleStack(line);
    }
    if (line.startsWith('move')) {
        const [_, amount, source, target] = movePattern.exec(
            line
        ) as RegExpExecArray;
        stacks[Number(target) - 1] = [
            ...stacks[Number(source) - 1].splice(0, Number(amount)).reverse(),
            ...stacks[Number(target) - 1],
        ];
    }
});

lineReader.on('close', () => {
    console.log(stacks.map((stack) => stack[0]).join(''));
});
