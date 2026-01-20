import { buildLoopAroundObject } from './buildLoopAroundObject';

describe('buildLoopAroundObject', () => {
    it('should build a config to loop around col and rows when set at true', () => {
        expect(buildLoopAroundObject(true)).toStrictEqual({
            col: 'next-loop',
            row: 'next-loop',
        });
    });

    it('should build a config to stop at the end when set at false', () => {
        const defaultLoopAround = {
            col: 'next-end',
            row: 'next-end',
        };
        expect(buildLoopAroundObject()).toStrictEqual(defaultLoopAround);
        expect(buildLoopAroundObject(false)).toStrictEqual(defaultLoopAround);
    });

    it("should return the given loopAround config if it's an object", () => {
        const config = {
            col: 'inside',
            row: 'next-end',
        } as const;
        expect(buildLoopAroundObject(config)).toEqual(config);
    });
});
