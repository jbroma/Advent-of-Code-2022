import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

let score1 = 0,
    score2 = 0;

const scoring1 = {
    AX: 4,
    AY: 8,
    AZ: 3,
    BX: 1,
    BY: 5,
    BZ: 9,
    CX: 7,
    CY: 2,
    CZ: 6,
};

const scoring2 = {
    AX: 3,
    AY: 4,
    AZ: 8,
    BX: 1,
    BY: 5,
    BZ: 9,
    CX: 2,
    CY: 6,
    CZ: 7,
};

type scoring1Key = keyof typeof scoring1;
type scoring2Key = keyof typeof scoring2;

lineReader.on('line', (line) => {
    const pair = line.split(' ').join('');
    score1 += scoring1[pair as scoring1Key];
    score2 += scoring2[pair as scoring2Key];
});

lineReader.on('close', () => {
    console.log('PART 1: ', score1);
    console.log('PART 2: ', score2);
});
