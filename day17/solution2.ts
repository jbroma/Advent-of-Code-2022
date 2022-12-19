import { initLineReader } from '../utils/lineReader';

type Point = [y: number, x: number];
type VerticalMoveResult = [anchor: Point, didMove: boolean];

const BOARD_INITIAL_LENGTH = 4;
const BOARD_WIDTH = 7;

const ROCK_DASH = [[0, 0, 2, 2, 2, 2, 0]];
const ROCK_PLUS = [
    [0, 0, 0, 2, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0],
    [0, 0, 0, 2, 0, 0, 0],
];
const ROCK_L = [
    [0, 0, 0, 0, 2, 0, 0],
    [0, 0, 0, 0, 2, 0, 0],
    [0, 0, 2, 2, 2, 0, 0],
];
const ROCK_I = [
    [0, 0, 2, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0],
];
const ROCK_SQUARE = [
    [0, 0, 2, 2, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 0],
];

const ROCKS = [ROCK_DASH, ROCK_PLUS, ROCK_L, ROCK_I, ROCK_SQUARE]
    .map((rock) => rock.reverse())
    .map((rock) => JSON.stringify(rock));

const ROCK_ANCHORS: Point[] = [
    [0, 2],
    [2, 2],
    [2, 2],
    [3, 2],
    [1, 2],
];

function addNewRock(rockType: number, board: number[][]): Point {
    const rock = JSON.parse(ROCKS[rockType]) as number[][];
    rock.forEach((row) => board.unshift(row));
    return ROCK_ANCHORS[rockType].slice() as Point;
}

function moveHorizontally(
    direction: string,
    anchor: Point,
    board: number[][]
): Point {
    let dir = direction === '<' ? -1 : 1;
    const moves: [Point, Point][] = [];
    outer: for (
        let y = Math.max(anchor[0] - 3, 0);
        y <= Math.min(anchor[0] + 3, board.length - 1);
        y++
    ) {
        for (let x = anchor[1]; x <= anchor[1] + 3; x++) {
            if (board[y][x] !== 2) continue;
            if (x + dir < 0 || x + dir >= BOARD_WIDTH) return anchor;
            if (board[y][x + dir] === 1) return anchor;
            const oldPosition: Point = [y, x];
            const newPosition: Point = [y, x + dir];
            moves.push([oldPosition, newPosition]);
        }
    }
    if (direction === '>') moves.reverse();
    for (const [oldPoint, newPoint] of moves) {
        board[newPoint[0]][newPoint[1]] = 2;
        board[oldPoint[0]][oldPoint[1]] = 0;
    }
    return [anchor[0], anchor[1] + dir];
}

function moveVertically(anchor: Point, board: number[][]): VerticalMoveResult {
    const moves: [Point, Point][] = [];
    outer: for (
        let y = Math.max(anchor[0] - 3, 0);
        y <= Math.min(anchor[0] + 3, board.length - 1);
        y++
    ) {
        for (let x = anchor[1]; x <= anchor[1] + 3; x++) {
            if (board[y][x] !== 2) continue;
            if (board[y + 1][x] === 1) {
                return [anchor, false];
            }
            const oldPosition: Point = [y, x];
            const newPosition: Point = [y + 1, x];
            moves.push([oldPosition, newPosition]);
        }
    }
    moves.reverse();
    for (const [oldPoint, newPoint] of moves) {
        board[oldPoint[0]][oldPoint[1]] = 0;
        board[newPoint[0]][newPoint[1]] = 2;
    }
    return [[anchor[0] + 1, anchor[1]], true];
}

function makeRockInactive(anchor: Point, board: number[][]) {
    for (
        let y = Math.max(anchor[0] - 3, 0);
        y <= Math.min(anchor[0] + 3, board.length - 1);
        y++
    ) {
        for (let x = anchor[1]; x <= anchor[1] + 3; x++) {
            if (board[y][x] === 2) board[y][x] = 1;
        }
    }
}

function findMaxY(board: number[][]): number {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 1) return y;
        }
    }
    throw new Error('Something went wrong');
}

function findHighestPoints(board: number[][]): number[] {
    const highestPoints: number[] = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < board.length; y++) {
            if (board[y][x] === 1) {
                highestPoints.push(y);
                break;
            }
        }
    }
    return highestPoints;
}

function adjustBoard(board: number[][]): number {
    const maxY = findMaxY(board);
    let rowsToRemove = maxY - 3;
    // console.log(`maxY was ${maxY}, removing ${rowsToRemove} rows`);
    board.splice(0, rowsToRemove);
    return maxY;
}

function printBoard(board: number[][]) {
    let line;
    console.log('-------');
    for (let y = 0; y < board.length; y++) {
        line = '';
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 2) {
                line += '@';
            } else if (board[y][x] === 1) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
    console.log('-------\n');
}

function getTowerHeight(
    first: [string, number, number],
    second: [string, number, number],
    heightsCache: Map<string, number>
) {
    const baseHeight = first[2];
    const loopHeight = second[2] - first[2];
    const rocksBetween = second[1] - first[1];

    const loopTimes = Math.floor((1_000_000_000_001 - first[1]) / rocksBetween);
    const missingRocks = Math.floor(
        (1_000_000_000_001 - first[1]) % rocksBetween
    );
    console.log(missingRocks);
    const cacheAsArray = [...heightsCache];
    const firstIndex = cacheAsArray.findIndex(([k]) => k === first[0]);

    return (
        loopTimes * loopHeight + cacheAsArray[firstIndex + missingRocks][1] - 1
    );
}

function mainLoop(board: number[][], jets: string) {
    let i = 0;
    let rockCount = 1;
    let rockType = 0;
    let currentJet = 0;
    let anchor = addNewRock(rockType, board);
    let verticalMoveResult: VerticalMoveResult;
    const cachedResults = new Map<string, number>();
    let firstLoopEncounter: [string, number, number] | null = null;
    let secondLoopEncounter: [string, number, number] | null = null;
    while (true) {
        anchor = moveHorizontally(jets[currentJet], anchor, board);
        currentJet = currentJet === jets.length - 1 ? 0 : currentJet + 1;
        verticalMoveResult = moveVertically(anchor, board);
        if (verticalMoveResult[1]) {
            anchor = verticalMoveResult[0];
        } else {
            makeRockInactive(verticalMoveResult[0], board);

            const maxY = adjustBoard(board);
            const highestPoints = String(findHighestPoints(board));
            const key = `${rockType}-${currentJet}-${highestPoints}`;
            if (cachedResults.get(key)) {
                if (!firstLoopEncounter) {
                    console.log(
                        `found 1st loop at ${rockCount}: ${cachedResults.get(
                            key
                        )}`
                    );
                    firstLoopEncounter = [
                        key,
                        rockCount,
                        board.length - maxY - 1,
                    ];
                } else if (
                    !secondLoopEncounter &&
                    key === firstLoopEncounter[0]
                ) {
                    console.log(
                        `found 2nd loop at ${rockCount}: ${cachedResults.get(
                            key
                        )}`
                    );
                    secondLoopEncounter = [
                        key,
                        rockCount,
                        board.length - maxY - 1,
                    ];
                    console.log(
                        `first loop encounter: (key, rockCounter, height) ${JSON.stringify(
                            firstLoopEncounter
                        )}`
                    );
                    console.log(
                        `second loop encounter: (key, rockCounter, height) ${JSON.stringify(
                            secondLoopEncounter
                        )}`
                    );
                    console.log(
                        getTowerHeight(
                            firstLoopEncounter,
                            secondLoopEncounter,
                            cachedResults
                        )
                    );
                    break;
                }
            }
            cachedResults.set(key, board.length - maxY - 1);
            // console.log(cachedResults);
            // printBoard(board);
            rockType = (rockType + 1) % 5;
            anchor = addNewRock(rockType, board);
            rockCount++;
        }
        // printBoard(board);
    }
    console.log('PART 1: ', board.length - findMaxY(board) - 1);
    // printBoard(board);
}

export default function () {
    const lineReader = initLineReader(__dirname);
    let jets: string;

    lineReader.on('line', (line) => {
        jets = line;
    });

    lineReader.on('close', () => {
        const board = Array.from({ length: BOARD_INITIAL_LENGTH }, (_, i) =>
            Array.from({ length: BOARD_WIDTH }, () => 0)
        );
        board[board.length - 1] = Array.from({ length: BOARD_WIDTH }, () => 1);

        mainLoop(board, jets);
    });
}
