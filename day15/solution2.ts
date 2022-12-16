import { initLineReader } from '../utils/lineReader';

const pattern = /^.*?x=(-?\d+).*?y=(-?\d+).*?x=(-?\d+).*?y=(-?\d+)$/;

function manhattanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getTuningFrequency(x: number, y: number): number {
    return x * 4_000_000 + y;
}

function calculateCoefficient(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): [number, number] {
    const a = (y1 - y2) / (x1 - x2);
    const b = y1 - a * x1;
    return [a, b];
}

function findAllCoefficients(
    x: number,
    y: number,
    radius: number
): [number, number][] {
    const first = calculateCoefficient(x - radius, y, x, y + radius);
    const second = calculateCoefficient(x, y + radius, x + radius, y);
    const third = calculateCoefficient(x + radius, y, x, y - radius);
    const fourth = calculateCoefficient(x, y - radius, x - radius, y);
    return [first, second, third, fourth];
}

function findIntersectionBetweenTwoLines(
    [a1, b1]: [number, number],
    [a2, b2]: [number, number]
): [number, number] {
    const x = (b2 - b1) / (a1 - a2);
    const y = a1 * x + b1;
    return [x, y];
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const sensors: [number, number, number][] = [];

    lineReader.on('line', (line) => {
        const match = line.match(pattern) as RegExpMatchArray;
        const [x1, y1, x2, y2] = match.slice(1, 5).map(Number);
        const distance = manhattanDistance(x1, y1, x2, y2);
        sensors.push([x1, y1, distance]);
    });

    lineReader.on('close', () => {
        let pairsWithGap = new Set<string>();
        for (const [i, [x1, y1, d1]] of sensors.entries()) {
            for (const [j, [x2, y2, d2]] of sensors.entries()) {
                const distance = manhattanDistance(x1, y1, x2, y2);
                const diff = Math.abs(distance - d1 - d2);
                if (diff === 2 && !pairsWithGap.has(JSON.stringify([j, i]))) {
                    pairsWithGap.add(JSON.stringify([i, j]));
                }
            }
        }
        const lines: [number, number][] = [];
        for (const pair of pairsWithGap) {
            const [firstPairIndex, secondPairIndex] = JSON.parse(pair);
            const [x1, y1, d1] = sensors[firstPairIndex];
            const [x2, y2, d2] = sensors[secondPairIndex];
            const coeffs1 = findAllCoefficients(x1, y1, d1 + 1).map(String);
            const coeffs2 = findAllCoefficients(x2, y2, d2 + 1).map(String);
            const [common] = coeffs1.filter((a) => coeffs2.includes(a));
            lines.push(common.split(',').map(Number) as [number, number]);
        }
        const [x, y] = findIntersectionBetweenTwoLines(lines[0], lines[1]);
        console.log('PART 2: ', getTuningFrequency(x, y));
    });
}
