import { initLineReader } from '../utils/lineReader';

const SNAFU_TO_DECIMAL = {
    '2': 2,
    '1': 1,
    '0': 0,
    '-': -1,
    '=': -2,
};

const SNAFU_SIGNS = {
    [4]: '-',
    [3]: '=',
    [2]: '2',
    [1]: '1',
    [0]: '0',
};

type vKey = keyof typeof SNAFU_TO_DECIMAL;
type sKey = keyof typeof SNAFU_SIGNS;

function divmod(dividend: number, divisor: number) {
    return [Math.floor(dividend / divisor), dividend % divisor];
}

export function convertToDecimal(number: string) {
    const rNumber = number.split('').reverse();
    let decimal = 0;
    for (let i = 0; i < number.length; i++) {
        decimal += 5 ** i * SNAFU_TO_DECIMAL[rNumber[i] as vKey];
    }
    return decimal;
}

export function convertToSNAFU(number: number) {
    let snafu: string = '',
        carry = number,
        quotient = 0,
        remainder = 0;
    do {
        [quotient, remainder] = divmod(carry, 5);
        carry = quotient;
        snafu += SNAFU_SIGNS[remainder as sKey];
        if (remainder > 2) carry++;
    } while (carry !== 0);
    return snafu.split('').reverse().join('');
}

export default function solution() {
    const lineReader = initLineReader(__dirname);
    const numbers: string[] = [];

    lineReader.on('line', (line) => {
        numbers.push(line);
    });

    lineReader.on('close', () => {
        const decimals = numbers.map(convertToDecimal);
        const sum = decimals.reduce((a,b) => a+ b, 0);
        const result = convertToSNAFU(sum);
        console.log('PART 1: ', result);
    });
}