import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

type NumberOrArray = number | NumberOrArray[];

const pairs: NumberOrArray[] = [[[2]], [[6]]];

lineReader.on('line', (line) => {
    if (line.startsWith('[')) {
        pairs.push(JSON.parse(line));
    }
});

function compare(left: NumberOrArray, right: NumberOrArray): number {
    if (typeof left === 'number' && typeof right === 'number') {
        return left - right;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
        for (const [i, v] of left.entries()) {
            if (right[i] === undefined) return 1;
            const result = compare(v, right[i]);
            if (result !== 0) return result;
        }
        return left.length - right.length;
    }
    if (typeof left === 'number' && typeof right !== 'number') {
        return compare([left], right);
    }
    if (typeof left !== 'number' && typeof right === 'number') {
        return compare(left, [right]);
    }
    throw new Error('Something went wrong!');
}

lineReader.on('close', () => {
    const result = pairs.sort(compare);
    const stringifiedResults = result.map((res) => JSON.stringify(res));
    const firstDividerPacketIndex =
        stringifiedResults.indexOf(JSON.stringify([[2]])) + 1;
    const secondDividerPacketIndex =
        stringifiedResults.indexOf(JSON.stringify([[6]])) + 1;
    console.log('PART 2: ', firstDividerPacketIndex * secondDividerPacketIndex);
});
