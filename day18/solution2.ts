import { initLineReader } from '../utils/lineReader';

const SIZE = 30;

type Point = [number, number, number];

// # - lava/obsidian
// . - water
// o - air

function countSidesOfCube(
    x: number,
    y: number,
    z: number,
    board: string[][][]
) {
    let i = 0;
    if (x === 0 || board[x - 1][y][z] === '.') i++;
    if (x === board.length - 1 || board[x + 1][y][z] === '.') i++;
    if (y === 0 || board[x][y - 1][z] === '.') i++;
    if (y === board[x].length - 1 || board[x][y + 1][z] === '.') i++;
    if (z === 0 || board[x][y][z - 1] === '.') i++;
    if (z === board[x][y].length - 1 || board[x][y][z + 1] === '.') i++;
    return i;
}

function floodFill(start: Point, board: string[][][]) {
    const queue = [];
    queue.push(start);
    while (queue.length) {
        let [x, y, z]: Point = queue.pop() as Point;
        board[x][y][z] = '.';
        if (x !== 0 && board[x - 1][y][z] === 'o') {
            queue.push([x - 1, y, z]);
        }
        if (x !== board.length - 1 && board[x + 1][y][z] === 'o') {
            queue.push([x + 1, y, z]);
        }
        if (y !== 0 && board[x][y - 1][z] === 'o') {
            queue.push([x, y - 1, z]);
        }
        if (y !== board[x].length - 1 && board[x][y + 1][z] === 'o') {
            queue.push([x, y + 1, z]);
        }
        if (z !== 0 && board[x][y][z - 1] === 'o') {
            queue.push([x, y, z - 1]);
        }
        if (z !== board[x][y].length - 1 && board[x][y][z + 1] === 'o') {
            queue.push([x, y, z + 1]);
        }
    }
}

function fillAirPockets(board: string[][][]) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            for (let k = 0; k < board[i][j].length; k++)
                if (board[i][j][k] === 'o') board[i][j][k] = '#';
        }
    }
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const points: string[][][] = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () =>
            Array.from({ length: SIZE }, () => 'o')
        )
    );
    const pointsToCheck: number[][] = [];

    lineReader.on('line', (line) => {
        const [x, y, z] = line.split(',').map(Number);
        points[x][y][z] = '#';
        pointsToCheck.push([x, y, z]);
    });

    lineReader.on('close', () => {
        let sum = 0;
        floodFill([0, 0, 0], points);
        fillAirPockets(points);
        for (const [x, y, z] of pointsToCheck) {
            sum += countSidesOfCube(x, y, z, points);
        }
        console.log('PART 2: ', sum);
    });
}
