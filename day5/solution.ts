import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

const movePattern = new RegExp(/move\s(\d+)\sfrom\s(\d)\sto\s(\d)/);

const stacks1 = Array.from({ length: 9 }, (_) => new Array());
const stacks2 = Array.from({ length: 9 }, (_) => new Array());

function assembleStack(line: string) {
    for (let i = 0, j = 1; i < 9; i++, j += 4) {
        if (line[j] !== ' ') {
            stacks1[i].push(line[j]);
            stacks2[i].push(line[j]);
        }
    }
}

lineReader.on('line', (line: string) => {
    if (line.startsWith('[')) {
        assembleStack(line);
    }
    if (line.startsWith('move')) {
        const [_, amount, source, target] = movePattern.exec(
            line
        ) as RegExpExecArray;
        // Part 1
        stacks1[Number(target) - 1] = [
            ...stacks1[Number(source) - 1].splice(0, Number(amount)).reverse(),
            ...stacks1[Number(target) - 1],
        ];
        // Part 2
        stacks2[Number(target) - 1] = [
            ...stacks2[Number(source) - 1].splice(0, Number(amount)),
            ...stacks2[Number(target) - 1],
        ];
    }
});

lineReader.on('close', () => {
    console.log('PART 1: ', stacks1.map((stack) => stack[0]).join(''));
    console.log('PART 2: ', stacks2.map((stack) => stack[0]).join(''));
});
