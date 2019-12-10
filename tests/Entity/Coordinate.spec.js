import Coordinate from '../../src/Entity/Coordinate';

describe('Coordinate', () => {
    test('item value of a Coordinate', () => {
        const p = new Coordinate(1, 12);

        expect(p.value).toBe('y=1&x=12;');
    });
    test('array contains a pair', () => {
        const p = new Coordinate(1, 12);
        const r = new Coordinate(0, 0);
        let a = [];

        a.push(new Coordinate(1, 1));
        a.push(new Coordinate(3, 7));
        a.push(new Coordinate(6, 4));
        a.push(new Coordinate(1, 12));
        a.push(new Coordinate(9, 3));
        a.push(new Coordinate(2, 6));

        expect(a.filter(e => e.value === p.value).length).toBe(1);
        expect(a.filter(e => e.value === r.value).length).toBe(0);
    });
});
