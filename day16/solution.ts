import { initLineReader } from '../utils/lineReader';

const pattern = /Valve\ (\w\w).*?(\d+);.*?valves?\ (.*)$/;
let maxPressure = -Infinity;

export class Node {
    name: string;
    flow: number;
    next: Array<Node>;

    constructor(name: string, flow: number) {
        this.name = name;
        this.flow = flow;
        this.next = [];
    }
}

function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addChildrenToNodes(
    nodes: Map<string, Node>,
    nodeChildren: Map<string, string>
) {
    for (const [name, children] of nodeChildren.entries()) {
        for (const child of children.split(', ')) {
            nodes.get(name)!.next.push(nodes.get(child) as Node);
        }
    }
}

function BFS(start: Node, target: Node): number {
    const explored = new Set<Node>();
    const parents = new Map<Node, Node>();
    const queue: Node[] = [];
    explored.add(start);
    queue.push(start);
    while (queue.length) {
        const node = queue.pop() as Node;
        if (node === target) {
            let i = 0,
                currentNode = node;
            while (currentNode !== start) {
                currentNode = parents.get(currentNode) as Node;
                i += 1;
            }
            return i;
        }
        for (const nextNode of node.next) {
            if (!explored.has(nextNode)) {
                explored.add(nextNode);
                parents.set(nextNode, node);
                queue.unshift(nextNode);
            }
        }
    }
    throw Error('No path possible');
}

export function pickBestNode(
    nodes: Array<[Node, number]>,
    movesLeft: number
): [Node, number] | null {
    const maxCost = nodes
        .slice()
        .filter(([_, c]) => c < movesLeft)
        .sort((a, b) => b[1] - a[1])[0]?.[1];
    if (maxCost === undefined) return null;
    const potentialValues = nodes
        .filter(([_, c]) => c < movesLeft)
        .map(([node, cost]) => [
            node,
            Math.max(maxCost - cost, 1) ** 2 * node.flow * Math.random(),
        ]) as [Node, number][];
    potentialValues.sort((a, b) => b[1] - a[1]);
    // console.log(potentialValues);
    return nodes.find((v) => v[0] === potentialValues[0][0]) as [Node, number];
}

function findBestPath(
    node: Node,
    nodesToVisit: Set<Node>,
    pressure: number,
    movesLeft: number,
    flowRate: number
): number {
    if (movesLeft === 0) return pressure;
    if (nodesToVisit.size === 0) return pressure + movesLeft * flowRate;
    if (nodesToVisit.has(node)) {
        const newFlowRate = flowRate + node.flow;
        nodesToVisit.delete(node);
        return findBestPath(
            node,
            nodesToVisit,
            pressure + flowRate,
            movesLeft - 1,
            newFlowRate
        );
    }
    const costs: [Node, number][] = Array.from(nodesToVisit).map((n) => [
        n,
        BFS(node, n),
    ]);
    const bestTarget = pickBestNode(costs, movesLeft);
    if (!bestTarget) {
        nodesToVisit.clear();
        return findBestPath(node, nodesToVisit, pressure, movesLeft, flowRate);
    }
    // console.log(bestTarget, movesLeft);
    return findBestPath(
        bestTarget[0],
        nodesToVisit,
        pressure + flowRate * bestTarget[1],
        movesLeft - bestTarget[1],
        flowRate
    );
}

export default function () {
    const lineReader = initLineReader(__dirname);
    const nodes = new Map<string, Node>();
    const nodeChildren = new Map<string, string>();

    lineReader.on('line', (line) => {
        const [_, name, flow, children] = line.match(
            pattern
        ) as RegExpMatchArray;
        const node = new Node(name, Number(flow));
        nodes.set(name, node);
        nodeChildren.set(name, children);
    });

    lineReader.on('close', () => {
        addChildrenToNodes(nodes, nodeChildren);
        const nodesWithFlow = new Set(
            Array.from(nodes.values()).filter((n) => n.flow)
        );
        const startingNode = nodes.get('AA') as Node;
        let max = -Infinity;
        while (true) {
            const result = findBestPath(
                startingNode,
                new Set(nodesWithFlow),
                0,
                30,
                0
            );
            if (result > max) {
                max = result;
                console.log(max);
            }
        }
    });
}
