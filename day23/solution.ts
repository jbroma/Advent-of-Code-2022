import { initLineReader } from '../utils/lineReader';

type Point = [number, number];

enum Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST,
}

class Elf {
    directions: Direction[];
    proposedMove: Point | null;

    constructor(
        public x: number,
        public y: number,
        private board: string[][],
        private potentialMoves: Map<string, number>
    ) {
        this.proposedMove = null;
        this.directions = [
            Direction.NORTH,
            Direction.SOUTH,
            Direction.WEST,
            Direction.EAST,
        ];
    }

    considerMoves() {
        const takenPosition: Point[][] = Array.from(
            { length: 4 },
            () => new Array()
        );
        for (let y = this.y - 1; y <= this.y + 1; y++) {
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (y === this.y && x === this.x) continue;
                if (this.board[y]?.[x] === '#') {
                    if (y === this.y - 1) takenPosition[0].push([x, y]);
                    if (y === this.y + 1) takenPosition[1].push([x, y]);
                    if (x === this.x - 1) takenPosition[2].push([x, y]);
                    if (x === this.x + 1) takenPosition[3].push([x, y]);
                }
            }
        }
        if (takenPosition.every((d) => !d.length)) return;
        this.considerDirections(takenPosition);
    }

    considerDirections(takenPositions: Point[][]) {
        for (const d of this.directions) {
            if (this.proposedMove) return;
            if (!takenPositions[d].length) this.proposeNewMove(d);
        }
    }

    proposeNewMove(d: Direction) {
        switch (d) {
            case Direction.NORTH:
                this.proposedMove = [this.x, this.y - 1];
                break;
            case Direction.SOUTH:
                this.proposedMove = [this.x, this.y + 1];
                break;
            case Direction.WEST:
                this.proposedMove = [this.x - 1, this.y];
                break;
            case Direction.EAST:
                this.proposedMove = [this.x + 1, this.y];
                break;
        }
        const key = String([this.proposedMove[0], this.proposedMove[1]]);
        const otherProposedMoves = this.potentialMoves.get(key);
        if (otherProposedMoves) {
            this.potentialMoves.set(key, otherProposedMoves + 1);
        } else this.potentialMoves.set(key, 1);
    }

    tryToMove() {
        if (!this.proposedMove) return;
        const numberOfContenders = this.potentialMoves.get(
            String([this.proposedMove[0], this.proposedMove[1]])
        ) as number;
        if (numberOfContenders > 1) return;
        if (!this.board[this.proposedMove[1]]?.[this.proposedMove[0]]) return;
        const isPlaceGoingToBeTaken =
            this.potentialMoves.get(String([this.x, this.y])) === 1;
        if (!isPlaceGoingToBeTaken) this.board[this.y][this.x] = '.';
        this.board[this.proposedMove[1]][this.proposedMove[0]] = '#';
        this.x = this.proposedMove[0];
        this.y = this.proposedMove[1];
    }

    circleDirections() {
        this.directions.push(this.directions.shift()!);
        this.proposedMove = null;
    }
}

function findElves(
    board: string[][],
    potentialMoves: Map<string, number>
): Elf[] {
    const elves: Elf[] = [];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === '#') {
                elves.push(new Elf(x, y, board, potentialMoves));
            }
        }
    }
    return elves;
}

function computeSolution(board: string[][]): number {
    let leftMost = Infinity,
        rightMost = -Infinity,
        upMost = Infinity,
        downMost = -Infinity;
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === '.') continue;
            if (x < leftMost) leftMost = x;
            if (x > rightMost) rightMost = x;
            if (y < upMost) upMost = y;
            if (y > downMost) downMost = y;
        }
    }
    let sum = 0;
    for (let y = upMost; y <= downMost; y++) {
        for (let x = leftMost; x <= rightMost; x++) {
            if (board[y][x] === '.') sum += 1;
        }
    }
    return sum;
}

function extendBoard(board: string[][], extendBy: number): string[][] {
    const newBoard: string[][] = [];
    const width = board[0].length;
    const height = board.length;
    for (let y = 0; y < height + extendBy * 2; y++) {
        if (y < extendBy || y >= height + extendBy) {
            const emptyRow = Array.from<string>({
                length: width + extendBy * 2,
            }).fill('.');
            newBoard.push(emptyRow);
            continue;
        }
        const leftPart = Array<string>(extendBy).fill('.');
        const rightPart = Array<string>(extendBy).fill('.');
        const modifiedRow = [...leftPart, ...board[y - extendBy], ...rightPart];
        newBoard.push(modifiedRow);
    }
    return newBoard;
}

function debugBoard(board: string[][]) {
    for (let y = 0; y < board.length; y++) {
        let line = '';
        for (let x = 0; x < board[y].length; x++) {
            line += board[y][x];
        }
        console.log(line);
    }
    console.log('--------------');
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const potentialMoves = new Map<string, number>();
    let board: string[][] = [];

    lineReader.on('line', (line) => {
        board.push(line.split(''));
    });

    lineReader.on('close', () => {
        board = extendBoard(board, 50);
        let round = 0;
        const elves = findElves(board, potentialMoves);

        do {
            round++;
            potentialMoves.clear();
            elves.forEach((elf) => elf.considerMoves());
            elves.forEach((elf) => elf.tryToMove());
            elves.forEach((elf) => elf.circleDirections());
            if (round === 10) {
                console.log('PART 1: ', computeSolution(board));
            }
        } while (potentialMoves.size !== 0);

        console.log('PART 2: ', round);
    });
}
