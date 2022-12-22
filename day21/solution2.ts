import { initLineReader } from '../utils/lineReader';

const numberPattern = /^(\w+):\ (\-?\d+)$/;
const equationPattern = /^(\w+):\ (\w+)\ ([+\-*\/])\ (\w+)$/;

type EquationMapValue = [
    [string, string, string],
    ReturnType<typeof createEquation>
];

function createEquation(operator: string) {
    if (operator === '+') return (op1: number, op2: number) => op1 + op2;
    if (operator === '-') return (op1: number, op2: number) => op1 - op2;
    if (operator === '*') return (op1: number, op2: number) => op1 * op2;
    if (operator === '/') return (op1: number, op2: number) => op1 / op2;
    throw new Error('Unrecognized operator');
}

function solve(
    key: string,
    results: Map<string, string>,
    equations: Map<string, EquationMapValue>
): number {
    const res = results.get(key);
    if (res && !Number.isNaN(Number(res))) return Number(res);
    const eqmv = equations.get(key);
    if (eqmv === undefined) return NaN;
    const [[op1, op2], eq] = eqmv;
    return eq(solve(op1, results, equations), solve(op2, results, equations));
}

function binarySearch(
    calculateResult: (x: number) => number,
    target: number,
    from: number,
    to: number
) {
    let mid: number, result: number;
    let low = from,
        high = to;
    while (low <= high) {
        mid = Math.round((low + high) / 2);
        result = calculateResult(mid);
        if (result === target) return mid;
        if (result > target) {
            low = mid + 1;
        } else {
            high = mid + 1;
        }
    }
    return NaN;
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const results = new Map<string, string>();
    const equations = new Map<string, EquationMapValue>();
    let leftSide: string, rightSide: string;

    lineReader.on('line', (line) => {
        let match = line.match(numberPattern);
        if (match) {
            if (match[1] === 'humn') return;
            results.set(match[1], match[2]);
        }
        match = line.match(equationPattern);
        if (match) {
            let operator = match[3];
            if (match[1] === 'root') {
                leftSide = match[2];
                rightSide = match[4];
                return;
            }
            equations.set(match[1], [
                [match[2], match[4], match[3]],
                createEquation(operator),
            ]);
        }
    });

    lineReader.on('close', () => {
        const [solved, unsolved] = (
            [
                [leftSide, solve(leftSide, results, equations)],
                [rightSide, solve(rightSide, results, equations)],
            ] as [string, number][]
        ).sort((a) => (Number.isNaN(a[1]) ? 1 : -1));
        solve(unsolved[0], results, equations);
        const callback = (x: number): number => {
            results.set('humn', String(x));
            const result = solve(unsolved[0], results, equations);
            return result;
        };
        const result = binarySearch(
            callback,
            solved[1],
            0,
            1_000_000_000_000_000
        );
        console.log('PART 2: ', result);
    });
}
