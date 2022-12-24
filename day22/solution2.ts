import { initLineReader } from '../utils/lineReader';

const pattern1 = /^\w+$/g;
const pattern2 = /\d+/;
const pattern3 = /[LR]/;

const CUBE_SIZE = 50;

type Point = [number, number];

enum Direction {
    RIGHT,
    DOWN,
    LEFT,
    UP,
}

// Neighbours of the sides when folded into a cube
// Access NEIGHBOURS like this:
// NEIGHBOURS[currentBoard][direction]
const NEIGHBOURS = [
    [1, 2, 3, 5],
    [4, 2, 0, 5],
    [1, 4, 3, 0],
    [4, 5, 0, 2],
    [1, 5, 3, 2],
    [4, 1, 0, 3],
];

// How direction changes when passing from one board to another
const DIRECTION_CHANGE = [
    [0, 1, 0, 0],
    [2, 2, 2, 3],
    [3, 1, 1, 3],
    [0, 1, 0, 0],
    [2, 2, 2, 3],
    [3, 1, 1, 3],
];

// For adjusting coordinates to match the ones in input
const SOLUTION_ADJUSTMENTS = [
    [50, 0],
    [100, 0],
    [50, 50],
    [0, 100],
    [50, 100],
    [0, 150],
];

function getCoordsOnNeighbouringBoard(
    cb: number, // currentBoardIndex
    cp: Point, // currentPoint
    d: Direction // direction
): Point {
    const nd = DIRECTION_CHANGE[cb][d];
    if (d === Direction.RIGHT) {
        switch (nd) {
            case Direction.RIGHT:
                return [0, cp[1]];
            case Direction.LEFT:
                return [CUBE_SIZE - 1, CUBE_SIZE - 1 - cp[1]];
            case Direction.UP:
                return [cp[1], CUBE_SIZE - 1];
        }
    }
    if (d === Direction.DOWN) {
        switch (nd) {
            case Direction.DOWN:
                return [cp[0], 0];
            case Direction.LEFT:
                return [CUBE_SIZE - 1, cp[0]];
        }
    }
    if (d === Direction.LEFT) {
        switch (nd) {
            case Direction.RIGHT:
                return [0, CUBE_SIZE - 1 - cp[1]];
            case Direction.DOWN:
                return [cp[1], 0];
            case Direction.LEFT:
                return [CUBE_SIZE - 1, cp[1]];
        }
    }
    if (d === Direction.UP) {
        switch (nd) {
            case Direction.RIGHT:
                return [0, cp[0]];
            case Direction.UP:
                return [cp[0], CUBE_SIZE - 1];
        }
    }
    throw new Error('Unknown transformation!');
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
    startingBoard: number,
    start: Point,
    direction: Direction,
    steps: number,
    boards: string[][][]
): [number, Point, Direction] {
    let cp = start;
    let cd = direction;
    let cb = startingBoard;
    let np: Point, nb: number, nbp: Point;

    for (let i = 0; i < steps; i++) {
        switch (cd) {
            case Direction.RIGHT:
                np = [cp[0] + 1, cp[1]];
                break;
            case Direction.LEFT:
                np = [cp[0] - 1, cp[1]];
                break;
            case Direction.DOWN:
                np = [cp[0], cp[1] + 1];
                break;
            case Direction.UP:
                np = [cp[0], cp[1] - 1];
                break;
        }
        if (boards[cb][np[1]]?.[np[0]] === '#') return [cb, cp, cd];
        if (!boards[cb][np[1]]?.[np[0]]) {
            nb = NEIGHBOURS[cb][cd];
            nbp = getCoordsOnNeighbouringBoard(cb, cp, cd);
            if (boards[nb][nbp[1]][nbp[0]] === '#') return [cb, cp, cd];
            cd = DIRECTION_CHANGE[cb][cd];
            cb = nb;
            cp = nbp;
        } else cp = np;
    }
    return [cb, cp, cd];
}

function getSolution(cb: number, cp: Point, d: Direction): number {
    const row = cp[1] + 1 + SOLUTION_ADJUSTMENTS[cb][1];
    const column = cp[0] + 1 + SOLUTION_ADJUSTMENTS[cb][0];
    return row * 1000 + 4 * column + d;
}

export default function () {
    const lineReader = initLineReader(__dirname);

    const boards: string[][][] = Array.from({ length: 6 }, () => new Array());
    let boardIndex = 0;
    let lineCounter = 0;
    let boardsInLine = 0;

    let steps: number[];
    let rotations: string[];

    lineReader.on('line', (line) => {
        if (!line) return;
        if (line.match(pattern1)) {
            rotations = line.split(pattern2).reverse().filter(Boolean);
            steps = line.split(pattern3).reverse().map(Number);
        } else {
            if (lineCounter % CUBE_SIZE === 0) boardIndex += boardsInLine;
            const trimmedLine = line.slice().replace(/\s/g, '').split('');
            boardsInLine = trimmedLine.length / CUBE_SIZE;
            for (let i = 0; i < trimmedLine.length / CUBE_SIZE; i++) {
                boards[boardIndex + i].push(
                    trimmedLine.slice(i * CUBE_SIZE, i * CUBE_SIZE + CUBE_SIZE)
                );
            }
            lineCounter++;
        }
    });

    lineReader.on('close', () => {
        let currentBoard = 0;
        let currentPosition: Point = [0, 0];
        let currentDirection = Direction.RIGHT;

        while (steps.length) {
            [currentBoard, currentPosition, currentDirection] =
                travelToNextDestination(
                    currentBoard,
                    currentPosition,
                    currentDirection,
                    steps.pop() as number,
                    boards
                );
            currentDirection = changeDirection(
                currentDirection,
                rotations.pop()
            );
        }

        const result = getSolution(
            currentBoard,
            currentPosition,
            currentDirection
        );
        console.log('PART 2: ', result);
    });
}
