const divisors = [3, 11, 7, 2, 19, 5, 17, 13];
const operands = [7, 5, NaN, 4, 17, 7, 6, 3];

function convertToRemainders(value: number): number[] {
    return divisors.map((divisor) => value % divisor);
}

const operandRemainders = operands.map(convertToRemainders);

const monkeysInput = [
    {
        items: [56, 56, 92, 65, 71, 61, 79].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v * operandRemainders[0][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[0] === 0 ? 3 : 7),
        timesInspected: 0,
    },
    {
        items: [61, 85].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v + operandRemainders[1][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[1] === 0 ? 6 : 4),
        timesInspected: 0,
    },
    {
        items: [54, 96, 82, 78, 69].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map((v, i) => v ** 2 % divisors[i]),
        test: (remainders: number[]): number => (remainders[2] === 0 ? 0 : 7),
        timesInspected: 0,
    },
    {
        items: [57, 59, 65, 95].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v + operandRemainders[3][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[3] === 0 ? 5 : 1),
        timesInspected: 0,
    },
    {
        items: [62, 67, 80].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v * operandRemainders[4][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[4] === 0 ? 2 : 6),
        timesInspected: 0,
    },
    {
        items: [91].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v + operandRemainders[5][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[5] === 0 ? 1 : 4),
        timesInspected: 0,
    },
    {
        items: [79, 83, 64, 52, 77, 56, 63, 92].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v + operandRemainders[6][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[6] === 0 ? 2 : 0),
        timesInspected: 0,
    },
    {
        items: [50, 97, 76, 96, 80, 56].map(convertToRemainders),
        op: (remainders: number[]): number[] =>
            remainders.map(
                (v, i) => (v + operandRemainders[7][i]) % divisors[i]
            ),
        test: (remainders: number[]): number => (remainders[7] === 0 ? 3 : 5),
        timesInspected: 0,
    },
];

type Monkeys = typeof monkeysInput;

function solution(monkeys: Monkeys) {
    for (let i = 0; i < 10000; i++) {
        for (const monkey of monkeys) {
            while (monkey.items.length) {
                let item = monkey.items.shift() as number[];
                item = monkey.op(item);
                monkeys[monkey.test(item)].items.push(item);
                monkey.timesInspected += 1;
            }
        }
    }
    return monkeys;
}

const sortedResults = solution(monkeysInput).sort(
    (a, b) => b.timesInspected - a.timesInspected
);

sortedResults.forEach((monkey, index) => {
    console.log(
        `Monkey ${index} inspected items ${monkey.timesInspected} times.`
    );
});

console.log(
    'PART 2: ',
    sortedResults[0].timesInspected * sortedResults[1].timesInspected
);
