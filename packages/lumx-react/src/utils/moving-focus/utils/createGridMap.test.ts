import { createGridMap } from './createGridMap';

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

describe('createGridMap', () => {
    it('should group all tabStops by rowIndex', () => {
        expect(createGridMap(mockGrid)).toStrictEqual({
            rowKeys: [0, 1, 2],
            tabStopsByRowKey: {
                0: row0,
                1: row1,
                2: row2,
            },
        });
    });
    it('should keep the tabStops order in rowKeys array', () => {
        const grid: any = [
            {
                id: '0-1',
                rowKey: 4,
            },
            {
                id: '0-2',
                rowKey: 3,
            },
            {
                id: '0-2',
                rowKey: 1,
            },
            {
                id: '0-4',
                rowKey: 2,
            },
        ];
        expect(createGridMap(grid)).toStrictEqual({
            rowKeys: [4, 3, 1, 2],
            tabStopsByRowKey: {
                4: [grid[0]],
                3: [grid[1]],
                1: [grid[2]],
                2: [grid[3]],
            },
        });
    });
});
