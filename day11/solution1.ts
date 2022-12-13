const monkeysInput = [
    {
        items: [56, 56, 92, 65, 71, 61, 79],
        op: (oldValue: number): number => oldValue * 7,
        test: (val: number): number => (val % 3 === 0 ? 3 : 7),
        timesInspected: 0,
    },
    {
        items: [61, 85],
        op: (oldValue: number): number => oldValue + 5,
        test: (val: number): number => (val % 11 === 0 ? 6 : 4),
        timesInspected: 0,
    },
    {
        items: [54, 96, 82, 78, 69],
        op: (oldValue: number): number => oldValue * oldValue,
        test: (val: number): number => (val % 7 === 0 ? 0 : 7),
        timesInspected: 0,
    },
    {
        items: [57, 59, 65, 95],
        op: (oldValue: number): number => oldValue + 4,
        test: (val: number): number => (val % 2 === 0 ? 5 : 1),
        timesInspected: 0,
    },
    {
        items: [62, 67, 80],
        op: (oldValue: number): number => oldValue * 17,
        test: (val: number): number => (val % 19 === 0 ? 2 : 6),
        timesInspected: 0,
    },
    {
        items: [91],
        op: (oldValue: number): number => oldValue + 7,
        test: (val: number): number => (val % 5 === 0 ? 1 : 4),
        timesInspected: 0,
    },
    {
        items: [79, 83, 64, 52, 77, 56, 63, 92],
        op: (oldValue: number): number => oldValue + 6,
        test: (val: number): number => (val % 17 === 0 ? 2 : 0),
        timesInspected: 0,
    },
    {
        items: [50, 97, 76, 96, 80, 56],
        op: (oldValue: number): number => oldValue + 3,
        test: (val: number): number => (val % 13 === 0 ? 3 : 5),
        timesInspected: 0,
    },
];

type Monkeys = typeof monkeysInput;

// Part 1
function solutionForPart1(monkeys: Monkeys) {
    for (let i = 0; i < 20; i++) {
        for (const monkey of monkeys) {
            while (monkey.items.length) {
                let item = monkey.items.shift() as number;
                item = Math.floor(monkey.op(item) / 3);
                monkeys[monkey.test(item)].items.push(item);
                monkey.timesInspected += 1;
            }
        }
    }
    return monkeys;
}

const sortedResult = solutionForPart1(monkeysInput).sort(
    (a, b) => b.timesInspected - a.timesInspected
);

sortedResult.forEach((monkey, index) => {
    console.log(
        `Monkey ${index} inspected items ${monkey.timesInspected} times.`
    );
});

console.log(
    'PART 1: ',
    sortedResult[0].timesInspected * sortedResult[1].timesInspected
);

export {}; // fix conflicting names;
