import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

const matrix: string[][] = [];

lineReader.on('line', (line) => {
    matrix.push(line.split(''));
});

const explored = new Set<String>();
const parents = new Map<string, string>();
const isValidMoveMap = new Map<string, boolean>();

function isValidMove(currentHeight: string, targetHeight: string): boolean {
    const cachedMove = isValidMoveMap.get(currentHeight + targetHeight);
    if (cachedMove) return cachedMove;
    const adjustedCurrentHeight = currentHeight === 'S' ? 'a' : currentHeight;
    const adjustedTargetHeight = targetHeight === 'E' ? 'z' : targetHeight;
    const result =
        adjustedTargetHeight.charCodeAt(0) -
            adjustedCurrentHeight.charCodeAt(0) <=
        1;
    isValidMoveMap.set(adjustedCurrentHeight + adjustedTargetHeight, result);
    return result;
}

function getValidMoves(x: number, y: number): number[][] {
    let validMoves: number[][] = [];
    // RIGHT
    if (
        y < matrix[x].length - 1 &&
        isValidMove(matrix[x][y], matrix[x][y + 1])
    ) {
        validMoves.push([x, y + 1]);
    }
    // LEFT
    if (y > 0 && isValidMove(matrix[x][y], matrix[x][y - 1])) {
        validMoves.push([x, y - 1]);
    }

    // UP
    if (x > 0 && isValidMove(matrix[x][y], matrix[x - 1][y])) {
        validMoves.push([x - 1, y]);
    }
    // DOWN
    if (x < matrix.length - 1 && isValidMove(matrix[x][y], matrix[x + 1][y])) {
        validMoves.push([x + 1, y]);
    }
    return validMoves;
}

function BFS(start: number[]): number[] {
    const queue = [];
    explored.add(String(start));
    queue.push(start);
    while (queue.length) {
        const point = queue.pop() as number[];
        if (matrix[point[0]][point[1]] === 'E') {
            return point;
        }
        for (const move of getValidMoves(point[0], point[1])) {
            if (!explored.has(String(move))) {
                explored.add(String(move));
                parents.set(String(move), String(point));
                queue.unshift(move);
            }
        }
    }
    throw Error('No path found');
}

lineReader.on('close', () => {
    const start = [20, 0];
    const finish = BFS(start);
    let startingNode = String(finish);
    let distance = 0;
    while (startingNode !== String(start)) {
        distance++;
        startingNode = parents.get(startingNode) as string;
    }
    console.log('PART 1: ', distance);
});
