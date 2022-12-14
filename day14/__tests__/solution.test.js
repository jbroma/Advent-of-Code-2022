import { drawRocks, addGrainOfSand } from '../solution';

describe('day14', () => {
    describe('drawRocks', () => {
        test('marks points in the range given', () => {
            const matrix = [
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['.', '.', '.'],
            ];
            const points = [
                [0, 0],
                [0, 2],
                [2, 2],
            ];
            drawRocks(points, matrix, { depth: 0 });
            expect(matrix).toEqual([
                ['#', '.', '.'],
                ['#', '.', '.'],
                ['#', '#', '#'],
            ]);
        });
    });

    describe('addGrainOfSand', () => {
        test('adds a grain of sand at the bottom', () => {
            const matrix = [
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['#', '#', '#'],
            ];
            addGrainOfSand(matrix, [1, 0], { depth: 2 });
            expect(matrix).toEqual([
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['.', 'o', '.'],
                ['#', '#', '#'],
            ]);
        });

        test('goes diagonally in case of an obstacle', () => {
            const matrix = [
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['.', '#', '.'],
                ['#', '#', '#'],
            ];
            addGrainOfSand(matrix, [1, 0], { depth: 2 });
            expect(matrix).toEqual([
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['o', '#', '.'],
                ['#', '#', '#'],
            ]);
            addGrainOfSand(matrix, [1, 0], { depth: 2 });
            expect(matrix).toEqual([
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['o', '#', 'o'],
                ['#', '#', '#'],
            ]);
            addGrainOfSand(matrix, [1, 0], { depth: 2 });
            expect(matrix).toEqual([
                ['.', '.', '.'],
                ['.', 'o', '.'],
                ['o', '#', 'o'],
                ['#', '#', '#'],
            ]);
        });
    });
});
