import { initLineReader } from '../utils/lineReader';

const pattern1 = /^\w+$/g;
const pattern2 = /\d+/;
const pattern3 = /[LR]/;

type Point = [number, number];

enum Direction {
    RIGHT,
    DOWN,
    LEFT,
    UP,
}

function scanLine(
    x: number,
    y: number,
    direction: Direction,
    board: string[][]
) {
    let boundaries: Point[] = [];
    if (direction === Direction.DOWN || direction === Direction.UP) {
        for (let i = 0; i < board.length; i++) {
            if (!boundaries.length && board[i][x]) {
                boundaries.push([x, i]);
            }
            if (boundaries.length === 1 && !board[i + 1]?.[x]) {
                boundaries.push([x, i]);
            }
        }
    } else {
        for (let i = 0; i < board[y].length; i++) {
            if (!boundaries.length && board[y][i]) {
                boundaries.push([i, y]);
            }
            if (boundaries.length === 1 && !board[y][i + 1]) {
                boundaries.push([i, y]);
            }
        }
    }
    return { boundaries };
}

function changeDirection(
    currentDirection: Direction,
    rotation: string | undefined
): Direction {
    if (!rotation) return currentDirection;
    if (rotation === 'L') {
        if (currentDirection == 0) return 3;
        return (currentDirection - 1) % 4;
    }
    return (currentDirection + 1) % 4;
}

function travelToNextDestination(
    start: Point,
    direction: Direction,
    steps: number,
    board: string[][]
): Point {
    let cp = start;
    const {
        boundaries: [b1, b2],
    } = scanLine(cp[0], cp[1], direction, board);
    console.log(`scan for p:${start}, d:${direction} ==> ${b1},${b2}`);
    for (let i = 0; i < steps; i++) {
        switch (direction) {
            case Direction.RIGHT: {
                const np: Point = [cp[0] + 1, cp[1]];
                if (board[np[1]][np[0]] === '#') return cp;
                if (!board[np[1]][np[0]]) {
                    if (board[b1[1]][b1[0]] === '#') return cp;
                    cp = b1;
                } else cp = np;
                break;
            }
            case Direction.LEFT: {
                const np: Point = [cp[0] - 1, cp[1]];
                if (board[np[1]][np[0]] === '#') return cp;
                if (!board[np[1]][np[0]]) {
                    if (board[b2[1]][b2[0]] === '#') return cp;
                    cp = b2;
                } else cp = np;
                break;
            }
            case Direction.DOWN: {
                const np: Point = [cp[0], cp[1] + 1];
                if (board[np[1]]?.[np[0]] === '#') return cp;
                if (!board[np[1]]?.[np[0]]) {
                    if (board[b1[1]][b1[0]] === '#') return cp;
                    cp = b1;
                } else cp = np;
                break;
            }
            case Direction.UP: {
                const np: Point = [cp[0], cp[1] - 1];
                if (board[np[1]]?.[np[0]] === '#') return cp;
                if (!board[np[1]]?.[np[0]]) {
                    if (board[b2[1]][b2[0]] === '#') return cp;
                    cp = b2;
                } else cp = np;
                break;
            }
        }
    }
    return cp;
}

function findStartingPosition(board: string[][]): Point {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '.') return [j, i];
        }
    }
    throw new Error('Could not find starting position');
}

function getSolution(p: Point, d: Direction): number {
    return (p[1] + 1) * 1000 + 4 * (p[0] + 1) + d;
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const board: string[][] = [];
    let steps: number[];
    let rotations: string[];

    lineReader.on('line', (line) => {
        if (!line) return;
        if (line.match(pattern1)) {
            rotations = line.split(pattern2).reverse().filter(Boolean);
            steps = line.split(pattern3).reverse().map(Number);
        } else {
            board.push(line.split('').map((c) => (c === ' ' ? '' : c)));
        }
    });

    lineReader.on('close', () => {
        let currentPosition = findStartingPosition(board);
        let currentDirection = Direction.RIGHT;

        while (steps.length) {
            currentPosition = travelToNextDestination(
                currentPosition,
                currentDirection,
                steps.pop() as number,
                board
            );
            currentDirection = changeDirection(
                currentDirection,
                rotations.pop()
            );
        }

        const result = getSolution(currentPosition, currentDirection);
        console.log(result, currentPosition, currentDirection);
    });
}
