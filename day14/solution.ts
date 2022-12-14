import { initLineReader } from '../utils/lineReader';

type Point = [number, number];

export function drawRocks(
    points: Point[],
    matrix: string[][],
    maxDepth: { depth: number }
) {
    for (let i = 1; i < points.length; i++) {
        const firstPoint = points[i - 1];
        const secondPoint = points[i];
        const biggerY = Math.max(firstPoint[1], firstPoint[1]);
        if (maxDepth.depth < biggerY) {
            maxDepth.depth = biggerY;
        }
        if (firstPoint[0] - secondPoint[0]) {
            const [smaller, bigger] = [firstPoint[0], secondPoint[0]].sort(
                (a, b) => a - b
            );
            for (let j = smaller; j <= bigger; j++) {
                matrix[firstPoint[1]][j] = '#';
            }
        } else {
            const [smaller, bigger] = [firstPoint[1], secondPoint[1]].sort(
                (a, b) => a - b
            );
            for (let j = smaller; j <= bigger; j++) {
                matrix[j][firstPoint[0]] = '#';
            }
        }
    }
}

export function addGrainOfSand(
    matrix: string[][],
    startingPoint: Point,
    maxDepth: { depth: number }
): boolean {
    let x = startingPoint[0];
    for (let y = 0; y < matrix.length - 1; y++) {
        if (y > maxDepth.depth) return false;
        if (matrix[y + 1][x] === '.') continue;
        if (matrix[y + 1][x - 1] === '.') {
            x -= 1;
            continue;
        }
        if (matrix[y + 1][x + 1] === '.') {
            x += 1;
            continue;
        }
        matrix[y][x] = 'o';
        return true;
    }
    throw new Error('Something went wrong');
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const depthCounter = { depth: 0 };
    const board: string[][] = Array.from({ length: 300 }, (_) =>
        new Array(1000).fill('.')
    );

    lineReader.on('line', (line) => {
        const points = line
            .split(' -> ')
            .map((pair) => pair.split(',').map(Number)) as Point[];
        drawRocks(points, board, depthCounter);
    });

    lineReader.on('close', () => {
        drawRocks(
            [
                [0, depthCounter.depth + 2],
                [9999, depthCounter.depth + 2],
            ],
            board,
            { depth: Infinity }
        );
        // Part 1
        let shouldContinue = true;
        let counter = 0;
        while (shouldContinue) {
            shouldContinue = addGrainOfSand(board, [500, 0], depthCounter);
            counter++;
        }
        counter--; // adjust for last iteration
        console.log('PART 1: ', counter);

        // Part 2
        while (board[0][500] !== 'o') {
            addGrainOfSand(board, [500, 0], { depth: Infinity });
            counter++;
        }
        console.log('PART 2: ', counter);
        // board.forEach((row) => console.log(row.join('')));
    });
}
