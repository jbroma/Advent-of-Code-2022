import { initLineReader } from '../utils/lineReader';

const lineReader = initLineReader(__dirname);

type Point = [number, number];

const headPathPoints: Array<Point> = [[0, 0]];
const tailPathPoints = new Map<number, Array<Point>>([
    [1, [[0, 0]]],
    [2, [[0, 0]]],
    [3, [[0, 0]]],
    [4, [[0, 0]]],
    [5, [[0, 0]]],
    [6, [[0, 0]]],
    [7, [[0, 0]]],
    [8, [[0, 0]]],
    [9, [[0, 0]]],
]);

function getHeadTargetPoint(
    [x, y]: Point,
    direction: string,
    offset: string
): Point {
    switch (direction) {
        case 'U':
            return [x, y + Number(offset)];
        case 'D':
            return [x, y - Number(offset)];
        case 'L':
            return [x - Number(offset), y];
        case 'R':
            return [x + Number(offset), y];
        default:
            throw Error(`Unrecognized direction: ${direction}`);
    }
}

function createPathToTarget(
    [sx, sy]: Point,
    [tx, ty]: Point,
    path: Array<Point>
): Array<Point> {
    let newPoint: Point;
    const distance = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);
    if (distance < 2) return path;
    if (sx !== tx && sy !== ty) {
        if (Math.abs(sx - tx) === 1) {
            newPoint = [tx, sy + Math.sign(ty - sy)];
        } else if (Math.abs(sy - ty) === 1) {
            newPoint = [sx + Math.sign(tx - sx), ty];
        } else {
            newPoint = [sx + Math.sign(tx - sx), sy + Math.sign(ty - sy)];
        }
    } else if (sx === tx) {
        newPoint = [tx, sy + Math.sign(ty - sy)];
    } else {
        newPoint = [sx + Math.sign(tx - sx), ty];
    }
    path.push(newPoint);
    return createPathToTarget(newPoint, [tx, ty], path);
}

lineReader.on('line', (line) => {
    const [direction, offset] = line.split(' ');
    const sourceHeadPosition = headPathPoints[headPathPoints.length - 1];
    const targetHeadPosition = getHeadTargetPoint(
        sourceHeadPosition,
        direction,
        offset
    );
    const newHeadPath = createPathToTarget(
        sourceHeadPosition,
        targetHeadPosition,
        []
    );
    newHeadPath.push(targetHeadPosition);

    for (const point of newHeadPath) {
        let pointToFollow = point;
        for (const tailPath of tailPathPoints.values()) {
            const lastPointInPath = tailPath[tailPath.length - 1];
            const newTailPath = createPathToTarget(
                lastPointInPath,
                pointToFollow,
                []
            );
            tailPath.push(...newTailPath);
            pointToFollow = tailPath[tailPath.length - 1];
        }
    }
    headPathPoints.push(...newHeadPath);
});

lineReader.on('close', () => {
    // Part 1
    const firstTailNode = tailPathPoints.get(1) as Array<Point>;
    console.log(new Set(firstTailNode.map(String)).size);

    // Part 2
    const ninthTailNode = tailPathPoints.get(9) as Array<Point>;
    console.log(new Set(ninthTailNode.map(String)).size);
});
