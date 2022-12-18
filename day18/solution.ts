import { initLineReader } from '../utils/lineReader';

const SIZE = 30;

function checkSidesOfCube(
    x: number,
    y: number,
    z: number,
    board: boolean[][][]
) {
    let i = 0;
    if (x === 0 || !board[x - 1][y][z]) i++;
    if (x === board.length - 1 || !board[x + 1][y][z]) i++;
    if (y === 0 || !board[x][y - 1][z]) i++;
    if (y === board[x].length - 1 || !board[x][y + 1][z]) i++;
    if (z === 0 || !board[x][y][z - 1]) i++;
    if (z === board[x][y].length - 1 || !board[x][y][z + 1]) i++;
    return i;
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const points: boolean[][][] = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () =>
            Array.from({ length: SIZE }, () => false)
        )
    );
    const pointsToCheck: number[][] = [];

    lineReader.on('line', (line) => {
        const [x, y, z] = line.split(',').map(Number);
        points[x][y][z] = true;
        pointsToCheck.push([x, y, z]);
    });

    lineReader.on('close', () => {
        let sum = 0;
        for (const [x, y, z] of pointsToCheck) {
            sum += checkSidesOfCube(x, y, z, points);
        }
        console.log('PART 1: ', sum);
    });
}
