import { initLineReader } from '../utils/lineReader';

const pattern = /^.*?x=(-?\d+).*?y=(-?\d+).*?x=(-?\d+).*?y=(-?\d+)$/;

export function manhattanDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export function isWithinRadiusOfSensor(
    point: [number, number],
    sensors: [number, number, number][]
): boolean {
    for (const [sx, sy, distance] of sensors) {
        if (manhattanDistance(point[0], point[1], sx, sy) <= distance) {
            return true;
        }
    }
    return false;
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const sensors: [number, number, number][] = [];
    const beacons = new Set<String>();
    let minX = Infinity;
    let maxX = -Infinity;

    lineReader.on('line', (line) => {
        const match = line.match(pattern) as RegExpMatchArray;
        const [x1, y1, x2, y2] = match.slice(1, 5).map(Number);
        const distance = manhattanDistance(x1, y1, x2, y2);
        if (x1 - distance < minX) {
            minX = x1 - distance;
        }
        if (x1 + distance > maxX) {
            maxX = x1 + distance;
        }
        sensors.push([x1, y1, distance]);
        beacons.add(String([x2, y2]));
    });

    lineReader.on('close', () => {
        let invalidPositions = 0;
        for (let i = minX; i <= maxX; i++) {
            const insideSensorRange = isWithinRadiusOfSensor(
                [i, 2000000],
                sensors
            );
            const isBeacon = beacons.has(String([i, 2000000]));
            if (insideSensorRange && !isBeacon) invalidPositions++;
        }
        console.log('PART 1: ', invalidPositions);
    });
}
