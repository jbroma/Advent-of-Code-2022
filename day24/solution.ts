import fs from 'fs';
import path from 'path';
import { initLineReader } from '../utils/lineReader';

// @ts-ignore map
Map.prototype.toJSON = function () {
    return { serializableMap: [...this] };
};
// @ts-ignore set
Set.prototype.toJSON = function () {
    return { serializableSet: [...this] };
};

function replacer(key: string, value: any) {
    return key === 'positions' ? undefined : value;
}

function reviver(key: string, value: any) {
    if (typeof value === 'object') {
        if ('serializableMap' in value) {
            return new Map(value.serializableMap);
        }
        if ('serializableSet' in value) {
            return new Set(value.serializableSet);
        }
    }
    return value;
}

type Point = [number, number];

class Blizzard {
    constructor(
        public x: number,
        public y: number,
        public direction: string,
        private boardWidth: number,
        private boardHeight: number,
        private positions: Map<string, Set<Blizzard>>
    ) {
        this.addPosition();
    }

    move() {
        this.removePosition();
        switch (this.direction) {
            case '>':
                this.moveRight();
                break;
            case '<':
                this.moveLeft();
                break;
            case 'v':
                this.moveDown();
                break;
            case '^':
                this.moveUp();
                break;
        }
        this.addPosition();
    }
    moveRight() {
        if (this.x + 1 === this.boardWidth - 1) {
            this.x = 1;
        } else this.x += 1;
    }
    moveLeft() {
        if (this.x - 1 === 0) {
            this.x = this.boardWidth - 2;
        } else this.x -= 1;
    }
    moveDown() {
        if (this.y + 1 === this.boardHeight - 1) {
            this.y = 1;
        } else this.y += 1;
    }
    moveUp() {
        if (this.y - 1 === 0) {
            this.y = this.boardHeight - 2;
        } else this.y -= 1;
    }
    addPosition() {
        const cp = String([this.x, this.y]);
        const positions = this.positions.get(cp);
        if (!positions) this.positions.set(cp, new Set([this]));
        else positions.add(this);
    }
    removePosition() {
        const cp = String([this.x, this.y]);
        const positions = this.positions.get(cp);
        positions!.delete(this);
        if (positions!.size === 0) this.positions.delete(cp);
    }
}

function findAllBlizzards(
    board: string[][],
    positions: Map<string, Set<Blizzard>>
): Blizzard[] {
    const blizzards = [];
    for (let i = 1; i < board.length - 1; i++) {
        for (let j = 1; j < board[i].length - 1; j++) {
            if (board[i][j] !== '.') {
                blizzards.push(
                    new Blizzard(
                        j,
                        i,
                        board[i][j],
                        board[i].length,
                        board.length,
                        positions
                    )
                );
            }
        }
    }
    return blizzards;
}

function getPossibleMoves(
    [x, y]: Point,
    positions: Map<string, Set<Blizzard>>,
    board: string[][]
): Point[] {
    if (x === 1 && y === 0) {
        if (!positions.get(String([x, y + 1]))) return [[x, y + 1]];
        else return [[x, y]];
    }
    if (x === 120 && y === 26) {
        if (!positions.get(String([x, y - 1]))) return [[x, y - 1]];
        else return [[x, y]];
    }
    const possibleMoves: Point[] = [[x, y]];
    if (board[y][x + 1] !== '#' && !positions.get(String([x + 1, y]))) {
        possibleMoves.push([x + 1, y]);
    }
    if (board[y][x - 1] !== '#' && !positions.get(String([x - 1, y]))) {
        possibleMoves.push([x - 1, y]);
    }
    if (board[y + 1][x] !== '#' && !positions.get(String([x, y + 1]))) {
        possibleMoves.push([x, y + 1]);
    }
    if (board[y - 1][x] !== '#' && !positions.get(String([x, y - 1]))) {
        possibleMoves.push([x, y - 1]);
    }
    return possibleMoves;
}

function findPath(
    cp: Point, // currentPosition
    m: number, // current minute
    tp: Point, // targetPosition
    pam: Map<string, Set<Blizzard>>[], // positionAtMinutes
    board: string[][],
    maxM: number,
    cache: Map<string, number>
): number {
    const key = JSON.stringify([cp, m, tp]);
    if (cache.get(key)) return cache.get(key)!;
    if (cp[0] === tp[0] && cp[1] === tp[1]) return m;
    if (m > maxM) return NaN;
    if (pam[m].get(String(cp))) return NaN;
    const possibleMoves = getPossibleMoves(cp, pam[m + 1], board);
    if (!possibleMoves.length)
        return findPath(cp, m + 1, tp, pam, board, maxM, cache);
    const outcomes = possibleMoves.map((np) =>
        findPath(np, m + 1, tp, pam, board, maxM, cache)
    );
    const result = Math.min(...outcomes.filter(Number.isFinite));
    cache.set(JSON.stringify([cp, m, tp]), result);
    return result;
}

function generatePositions(
    positions: Map<string, Set<Blizzard>>,
    blizzards: Blizzard[],
    minutes: number
) {
    const positionsAtMinutes = [
        JSON.parse(JSON.stringify(positions, replacer), reviver),
    ];
    for (let i = 1; i <= minutes; i++) {
        if (i % 20 === 0) console.log(`generating for: ${i} minute`);
        blizzards.forEach((b) => b.move());
        positionsAtMinutes.push(
            JSON.parse(JSON.stringify(positions, replacer), reviver)
        );
    }
    return positionsAtMinutes;
}

export default function () {
    const SIMULATION_LIMIT = 1000;
    const SINGLE_RUN_LIMIT = 350;
    const lineReader = initLineReader(__dirname);
    const board: string[][] = [];
    const positions = new Map<string, Set<Blizzard>>();
    const cache = new Map<string, number>();

    let startingPosition: Point = [1, 0];
    let targetPosition: Point;

    lineReader.on('line', (line) => {
        board.push(line.split(''));
    });

    lineReader.on('close', () => {
        board[0][1] = '#';
        targetPosition = [board[board.length - 1].length - 2, board.length - 1];
        // generate positions for blizzards for given amount of time
        // const blizzards = findAllBlizzards(board, positions);
        // const positionsAtMinutes = generatePositions(
        //     positions,
        //     blizzards,
        //     SIMULATION_LIMIT + 1
        // );
        // const data = JSON.stringify(positionsAtMinutes, replacer);
        // fs.writeFileSync(path.join(__dirname, 'positions.json'), data);

        const rawData = fs.readFileSync(
            path.join(__dirname, 'positions.json'),
            'utf-8'
        );
        const positionsAtMinutes = JSON.parse(rawData, reviver);
        let result = findPath(
            startingPosition,
            0,
            targetPosition,
            positionsAtMinutes,
            board,
            SINGLE_RUN_LIMIT,
            cache
        );
        console.log('PART 1: ', result);
        // now go back to beginning
        board[startingPosition[1]][startingPosition[0]] = '.';
        board[targetPosition[1]][targetPosition[0]] = '#';
        [startingPosition, targetPosition] = [targetPosition, startingPosition];
        result = findPath(
            startingPosition,
            result,
            targetPosition,
            positionsAtMinutes,
            board,
            result + SINGLE_RUN_LIMIT,
            cache
        );
        // and now back to the end
        board[startingPosition[1]][startingPosition[0]] = '.';
        board[targetPosition[1]][targetPosition[0]] = '#';
        [startingPosition, targetPosition] = [targetPosition, startingPosition];
        result = findPath(
            startingPosition,
            result,
            targetPosition,
            positionsAtMinutes,
            board,
            result + SINGLE_RUN_LIMIT,
            cache
        );
        console.log('PART 2: ', result);
    });
}
