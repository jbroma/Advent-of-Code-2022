import { initLineReader } from '../utils/lineReader';

class MovableNumber {
    constructor(public value: number, public realValue: number) {}
}

function move(index: number, numbers: MovableNumber[]): MovableNumber[] {
    if (numbers[index].value === 0) return numbers;
    const indexSum = index + numbers[index].value;
    let targetIndex = indexSum % (numbers.length - 1);
    if (indexSum < 0) targetIndex += numbers.length - 1;
    if (index === targetIndex) return numbers;
    const removed = [...numbers.slice(0, index), ...numbers.slice(index + 1)];
    const added = [
        ...removed.slice(0, targetIndex),
        numbers[index],
        ...removed.slice(targetIndex),
    ];
    return added;
}

function getSolution(numbers: MovableNumber[]): number {
    const zeroIndex = numbers.findIndex((v) => v.value === 0);
    const indices = [1000, 2000, 3000].map((v) => {
        return (v + zeroIndex) % numbers.length;
    });
    return indices.reduce((a, b) => a + numbers[b].realValue, 0);
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const numbers: MovableNumber[] = [];

    lineReader.on('line', (line) => {
        numbers.push(new MovableNumber(Number(line), Number(line)));
    });

    lineReader.on('close', () => {
        // Part 1
        let mixedNumbers = numbers.slice();
        for (const number of numbers) {
            const next = mixedNumbers.findIndex((v) => v === number);
            mixedNumbers = move(next, mixedNumbers);
        }
        const result1 = getSolution(mixedNumbers);
        console.log('PART 1: ', result1);

        // Part 2
        const DECRYPTION_KEY = 811589153;
        const decryptionKeyMod = DECRYPTION_KEY % (numbers.length - 1);

        numbers.forEach((v) => {
            v.value *= decryptionKeyMod;
            v.realValue *= DECRYPTION_KEY;
        });

        mixedNumbers = numbers.slice();
        for (let i = 0; i < 10; i++) {
            for (const number of numbers) {
                const next = mixedNumbers.findIndex((v) => v === number);
                mixedNumbers = move(next, mixedNumbers);
            }
        }
        const result2 = getSolution(mixedNumbers);
        console.log('PART 2: ', result2);
    });
}
