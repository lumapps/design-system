import { createGridMap } from './createGridMap';
import { getCell } from './getCell';

const row0 = [
    {
        id: '0-1',
        rowKey: 0,
    },
    {
        id: '0-2',
        rowKey: 0,
    },
    {
        id: '0-2',
        rowKey: 0,
    },
    {
        id: '0-4',
        rowKey: 0,
    },
];
const row1 = [
    {
        id: '1-1',
        rowKey: 1,
    },
    {
        id: '1-2',
        rowKey: 1,
        disabled: true,
    },
    {
        id: '1-3',
        rowKey: 1,
    },
    {
        id: '1-4',
        rowKey: 1,
    },
];
const row2 = [
    {
        id: '2-1',
        rowKey: 2,
    },
    {
        id: '2-2',
        rowKey: 2,
    },
    {
        id: '2-3',
        rowKey: 2,
    },
    {
        id: '2-4',
        rowKey: 2,
    },
];
const mockGrid: any = [...row0, ...row1, ...row2];

describe('getCell', () => {
    it('should get the cell at the given coordinates', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, { col: 1, row: 1 });

        expect(cell).toEqual(row1[1]);
    });

    it('should get the next enabled cell in the given row from the given column', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, { col: { from: 1, direction: 'asc' }, row: 1 });

        // It should select the col after the disabled col.
        expect(cell).toEqual(row1[2]);
    });

    it('should get the previous enabled cell in the given row from the given column', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, { col: { from: 1, direction: 'desc' }, row: 1 });

        // It should select the col after the disabled col.
        expect(cell).toEqual(row1[0]);
    });

    it('should get the next enabled cell in the given column from the given row', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, { col: 1, row: { from: 1, direction: 'asc' } });

        expect(cell).toEqual(row2[1]);
    });

    it('should allow a selector function to add rules', () => {
        const gridMap = createGridMap(mockGrid);

        // Retrieve all tabStops, even if disabled.
        const selector = (tabStop: any) => Boolean(tabStop);
        const cell = getCell(gridMap, { col: 1, row: { from: 1, direction: 'asc' } }, selector);

        expect(cell).toEqual(row1[1]);
        expect(cell?.disabled).toEqual(true);
    });

    it('should get the last enabled cell of the given column', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, {
            col: 1,
            row: {
                from: -1,
                direction: 'desc',
            },
        });

        expect(cell).toEqual(row2[1]);
    });

    it('should get the last enabled cell of the given row', () => {
        const gridMap = createGridMap(mockGrid);
        const cell = getCell(gridMap, {
            row: 1,
            col: {
                from: -1,
                direction: 'desc',
            },
        });

        // Use array indexing instead of .at() to avoid TS error if target is old
        expect(cell).toEqual(row1[row1.length - 1]);
    });
});
