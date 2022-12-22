import { initLineReader } from '../utils/lineReader';

const numberPattern = /^(\w+):\ (\-?\d+)$/;
const equationPattern = /^(\w+):\ (\w+)\ ([+\-*\/])\ (\w+)$/;

type EquationMapValue = [[string, string], ReturnType<typeof createEquation>];

function createEquation(operator: string) {
    if (operator === '+') return (op1: number, op2: number) => op1 + op2;
    if (operator === '-') return (op1: number, op2: number) => op1 - op2;
    if (operator === '*') return (op1: number, op2: number) => op1 * op2;
    if (operator === '/') return (op1: number, op2: number) => op1 / op2;
    throw new Error('Unrecognized operator');
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const results = new Map<string, number>();
    const equations = new Map<string, EquationMapValue>();
    let queue: string[] = [];

    lineReader.on('line', (line) => {
        let match = line.match(numberPattern);
        if (match) {
            results.set(match[1], Number(match[2]));
        }
        match = line.match(equationPattern);
        if (match) {
            equations.set(match[1], [
                [match[2], match[4]],
                createEquation(match[3]),
            ]);
            queue.push(match[1]);
        }
    });

    lineReader.on('close', () => {
        outer: while (!results.get('root')) {
            for (const key of queue) {
                const [operands, eq] = equations.get(key) as EquationMapValue;
                const op1 = results.get(operands[0]);
                const op2 = results.get(operands[1]);
                if (op1 && op2) {
                    results.set(key, eq(+op1, +op2));
                    queue = queue.filter((k) => k !== key);
                    continue outer;
                }
            }
        }
        console.log('PART 1: ', results.get('root'));
    });
}
