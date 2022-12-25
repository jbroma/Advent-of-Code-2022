import each from 'jest-each';
import { convertToDecimal, convertToSNAFU } from '../solution';

describe('day25', () => {
    describe('convertToDecimal', () => {
        each([
            ['1=-0-2', 1747],
            ['12111', 906],
            ['2=0=', 198],
            ['21', 11],
            ['2=01', 201],
            ['111', 31],
            ['20012', 1257],
            ['112', 32],
            ['1=-1=', 353],
            ['1-12', 107],
            ['12', 7],
            ['1=', 3],
            ['122', 37],
        ]).test('converts SNAFU: %s to decimal: %s', (snafu, decimal) => {
            expect(convertToDecimal(snafu)).toEqual(decimal);
        });
    });

    describe('convertToSNAFU', () => {
        each([
            [1747, '1=-0-2'],
            [906, '12111'],
            [198, '2=0='],
            [11, '21'],
            [201, '2=01'],
            [31, '111'],
            [1257, '20012'],
            [32, '112'],
            [353, '1=-1='],
            [107, '1-12'],
            [7, '12'],
            [3, '1='],
            [37, '122'],
        ]).test('converts decimal: %s to SNAFU: %s', (decimal, snafu) => {
            expect(convertToSNAFU(decimal)).toEqual(snafu);
        });
    });
});
