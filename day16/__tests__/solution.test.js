import { pickBestNode, Node } from '../solution';

describe('day16', () => {
    describe('pickBestNode', () => {
        test('picks best node', () => {
            const input = [
                [new Node('A', 3), 1],
                [new Node('B', 1), 1],
                [new Node('C', 14), 5],
            ];
            const result = pickBestNode(input);
            expect(result[0].name).toEqual('C');
        });
    });
});
