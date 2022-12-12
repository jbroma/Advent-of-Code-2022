import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

const addxPattern = /^addx\ (-?\d+)$/;

let cycleCounterPart1 = { count: 0 };
let cycleCounterPart2 = { count: 0 };

const registerValuesDuringCycles = new Map<number, number>([[0, 1]]);
const registerValuesOnCycleEnds = new Map<number, number>([[0, 1]]);

function processInput(
    line: string,
    counter: { count: number },
    registerValues: Map<number, number>,
    endMode: boolean
) {
    const currentCycle = ++counter.count;
    const currentValue =
        registerValues.get(currentCycle) ??
        (registerValues.get(currentCycle - 1) as number);
    const match = line.match(addxPattern);
    registerValues.set(currentCycle, currentValue);
    if (match) {
        if (endMode) {
            registerValues.set(
                ++counter.count,
                currentValue + Number(match[1])
            );
        } else {
            registerValues.set(++counter.count, currentValue);
            registerValues.set(
                counter.count + 1,
                currentValue + Number(match[1])
            );
        }
    }
}

lineReader.on('line', (line) => {
    processInput(line, cycleCounterPart1, registerValuesDuringCycles, false);
    processInput(line, cycleCounterPart2, registerValuesOnCycleEnds, true);
});

lineReader.on('close', () => {
    // Part 1
    const values = [
        (registerValuesDuringCycles.get(20) as number) * 20,
        (registerValuesDuringCycles.get(60) as number) * 60,
        (registerValuesDuringCycles.get(100) as number) * 100,
        (registerValuesDuringCycles.get(140) as number) * 140,
        (registerValuesDuringCycles.get(180) as number) * 180,
        (registerValuesDuringCycles.get(220) as number) * 220,
    ] as Array<number>;
    console.log(values.reduce((a, b) => a + b, 0));

    // Part 2
    let output = '';
    for (const [cycle, spriteCenter] of registerValuesOnCycleEnds) {
        if (cycle % 40 === 0) output += '\n';
        if (Math.abs((cycle % 40) - spriteCenter) <= 1) {
            output += '#';
        } else {
            output += '.';
        }
    }
    console.log(output);
});
