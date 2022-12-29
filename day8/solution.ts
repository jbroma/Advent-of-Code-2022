import { initLineReader } from '../utils/lineReader';

type OperationParam = { i: number; j: number };

const ops = [
    (params: OperationParam) => params.i++,
    (params: OperationParam) => params.i--,
    (params: OperationParam) => params.j++,
    (params: OperationParam) => params.j--,
];

function checkIfTreeIsVisible(
    x: number,
    y: number,
    matrix: readonly number[][]
): boolean {
    outer: for (const operation of ops) {
        for (
            const p = { i: x, j: y };
            p.i >= 0 &&
            p.i < matrix.length &&
            p.j >= 0 &&
            p.j < matrix[p.i].length;
            operation(p)
        ) {
            if (p.i === x && p.j === y) continue;
            if (matrix[p.i][p.j] >= matrix[x][y]) {
                continue outer;
            }
        }
        return true;
    }
    return false;
}

function calculateTreeScenicScore(
    x: number,
    y: number,
    matrix: readonly number[][]
): number {
    if (
        x === 0 ||
        y === 0 ||
        x === matrix.length - 1 ||
        y === matrix[x].length - 1
    ) {
        return 0;
    }
    let localScenicScore = 1,
        globalScenicScore = 1;

    outer: for (const operation of ops) {
        globalScenicScore *= localScenicScore;
        localScenicScore = 0;
        for (
            const p = { i: x, j: y };
            p.i >= 0 &&
            p.i < matrix.length &&
            p.j >= 0 &&
            p.j < matrix[p.i].length;
            operation(p)
        ) {
            if (p.i === x && p.j === y) continue;
            localScenicScore += 1;
            if (matrix[p.i][p.j] >= matrix[x][y]) {
                continue outer;
            }
        }
    }
    return globalScenicScore * localScenicScore;
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const matrix: number[][] = [];

    lineReader.on('line', (line: string) => {
        matrix.push(line.split('').map(Number));
    });

    lineReader.on('close', () => {
        let visibleCount = 0;
        let maxScenicScore = 0;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const visible = checkIfTreeIsVisible(i, j, matrix);
                if (visible) visibleCount++;
                const score = calculateTreeScenicScore(i, j, matrix);
                if (score > maxScenicScore) maxScenicScore = score;
            }
        }

        console.log('PART 1: ', visibleCount);
        console.log('PART 2: ', maxScenicScore);
    });
}
