import { initLineReader } from '../utils/lineReader';

const ITERATIONS = 100000;

const pattern =
    /Blueprint\ (\d+):.*?(\d+)\ ore.*?(\d+)\ ore.*?(\d+)\ ore.*?(\d+)\ clay.*?(\d)\ ore.*?(\d+)\ obsidian\.$/;

class Blueprint {
    constructor(public id: number, public robotCosts: number[][]) {}
}

class State {
    constructor(
        public robots: number[],
        public resources: number[],
        public queue: number[]
    ) {}

    getAffordableRobots(bp: Blueprint): Set<number> {
        const affordableRobots = new Set<number>();
        outer: for (let i = 0; i < this.robots.length; i++) {
            for (let j = 0; j < this.resources.length; j++) {
                if (
                    bp.robotCosts[i][j] !== 0 &&
                    this.resources[j] < bp.robotCosts[i][j]
                )
                    continue outer;
            }
            affordableRobots.add(i);
        }
        // console.log(`affordable: ${affordableRobots}`);
        return affordableRobots;
    }

    spendResources(bp: Blueprint, robotIndex: number) {
        // console.log(`building robot: ${robotIndex}`);
        this.queue[robotIndex] += 1;
        for (let i = 0; i < this.resources.length; i++) {
            this.resources[i] -= bp.robotCosts[robotIndex][i];
        }
    }
    gatherResources() {
        for (let i = 0; i < this.robots.length; i++) {
            this.resources[i] += this.robots[i];
        }
        // console.log(`ore: ${this.resources[0]}, ore robots: ${this.robots[0]}`);
        // console.log(
        //     `clay: ${this.resources[1]}, clay robots: ${this.robots[1]}`
        // );
        // console.log(
        //     `obsidian: ${this.resources[2]}, obsidian robots: ${this.robots[2]}`
        // );
        // console.log(
        //     `geodes: ${this.resources[3]}, geode robots: ${this.robots[3]}`
        // );
    }
    collectRobots() {
        // console.log(`new robot arrived: ${this.queue}`);
        for (let i = 0; i < this.robots.length; i++) {
            this.robots[i] += this.queue[i];
            this.queue[i] -= this.queue[i];
        }
    }
}

function getAllVariations(results: number[][], prev: number[]) {
    if (prev.length === 11) {
        results.push(prev);
        return;
    }
    const maxIndex = prev.length > 2 ? (prev.length > 4 ? 4 : 3) : 2;
    for (let i = -1; i < maxIndex; i++) {
        getAllVariations(results, [...prev, i]);
    }
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseWhatToBuild(state: State, bp: Blueprint): number {
    // if (sequence[0] === -1) return sequence.shift() as number;
    // const affordableRobots = state.getAffordableRobots(bp);
    // if (!sequence.length && affordableRobots.includes(3)) return 3;
    // if (affordableRobots.includes(sequence[0])) {
    //     return sequence.shift() as number;
    // }
    // return -1;
    const affordableRobots = state.getAffordableRobots(bp);
    if (affordableRobots.has(3)) return 3;
    if (affordableRobots.has(2)) return 2;
    const choice = getRandomInt(-1, 2);
    return choice !== -1 && affordableRobots.has(choice) ? choice : -1;
}

function runSimulation(bp: Blueprint): number {
    const state = new State([1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]);
    let i = 0;
    while (i++ < 24) {
        const choice = chooseWhatToBuild(state, bp);
        if (choice >= 0) state.spendResources(bp, choice);
        state.gatherResources();
        state.collectRobots();
        // console.log('----------\n');
    }
    return state.resources[3];
}

function findBestSimulation(bp: Blueprint): number {
    let i = 0;
    let max = -Infinity;
    let result;
    while (i++ < ITERATIONS) {
        result = runSimulation(bp);
        if (result > max) max = result;
    }
    return max;
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const blueprints: Blueprint[] = [];

    lineReader.on('line', (line) => {
        const match = line.match(pattern) as RegExpMatchArray;
        blueprints.push(
            new Blueprint(+match[1], [
                [+match[2], 0, 0, 0],
                [+match[3], 0, 0, 0],
                [+match[4], +match[5], 0, 0],
                [+match[6], 0, +match[7], 0],
            ])
        );
    });

    lineReader.on('close', () => {
        let max = 0;
        while (true) {
            let sum = 0;
            for (const bp of blueprints) {
                sum += findBestSimulation(bp) * bp.id;
            }
            if (sum > max) {
                max = sum;
                console.log(sum);
            }
        }
    });
}
