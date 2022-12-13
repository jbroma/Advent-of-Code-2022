import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

type NumberOrArray = number | NumberOrArray[];

const pairs: NumberOrArray[][] = [];
let currentPair: NumberOrArray[] = [];

lineReader.on('line', (line) => {
    if (line.startsWith('[')) {
        currentPair.push(JSON.parse(line));
    } else {
        pairs.push(currentPair);
        currentPair = [];
    }
});

function compare(
    left: NumberOrArray,
    right: NumberOrArray
): boolean | undefined {
    if (typeof left === 'number' && typeof right === 'number') {
        if (left === right) return undefined;
        return left < right;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
        for (const [i, v] of left.entries()) {
            if (right[i] === undefined) return false;
            const result = compare(v, right[i]);
            if (typeof result === 'boolean') return result;
        }
        return left.length < right.length ? true : undefined;
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
    const result = pairs.map(([left, right]) => compare(left, right));
    const sum = result.reduce((a, b, i) => a + (b ? i + 1 : 0), 0);
    console.log('PART 1: ', sum);
});
