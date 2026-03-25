import { getTextProps, CLASSNAME } from './index';
import { ColorPalette, ColorVariant, Typography, WhiteSpace } from '../../constants';

describe('getTextProps', () => {
    it('should return basic classes', () => {
        const props = getTextProps({});
        expect(props.className).toContain(CLASSNAME);
        expect(props.style).toEqual({});
    });

    it('should merge custom className', () => {
        const props = getTextProps({ className: 'custom-class' });
        expect(props.className).toContain('custom-class');
        expect(props.className).toContain(CLASSNAME);
    });

    it('should add typography class', () => {
        const props = getTextProps({ typography: Typography.body1 });
        expect(props.className).toContain('lumx-typography-body1');
    });

    it('should add color and variant classes', () => {
        const props = getTextProps({ color: ColorPalette.primary, colorVariant: ColorVariant.L1 });
        expect(props.className).toContain('lumx-color-font-primary-L1');
    });

    it('should add no-wrap class', () => {
        const props = getTextProps({ noWrap: true });
        expect(props.className).toContain(`${CLASSNAME}--no-wrap`);
    });

    describe('truncation', () => {
        it('should add single-line truncation class', () => {
            const props = getTextProps({ truncate: true });
            expect(props.className).toContain(`${CLASSNAME}--is-truncated`);
            expect(props.style).toEqual({});
        });

        it('should treat truncate: { lines: 1 } as single-line truncation', () => {
            const props = getTextProps({ truncate: { lines: 1 } });
            expect(props.className).toContain(`${CLASSNAME}--is-truncated`);
            expect(props.className).not.toContain(`${CLASSNAME}--is-truncated-multiline`);
            expect(props.style).toEqual({});
        });

        it('should add multi-line truncation class and style', () => {
            const props = getTextProps({ truncate: { lines: 3 } });
            expect(props.className).toContain(`${CLASSNAME}--is-truncated-multiline`);
            expect(props.style).toEqual({ '--lumx-text-truncate-lines': 3 });
        });
    });

    describe('white-space', () => {
        it('should add white-space style', () => {
            const props = getTextProps({ whiteSpace: WhiteSpace.pre });
            expect(props.style).toEqual({ '--lumx-text-white-space': WhiteSpace.pre });
        });

        it('should ignore white-space style if noWrap is true', () => {
            const props = getTextProps({ whiteSpace: WhiteSpace.pre, noWrap: true });
            expect(props.style).toEqual({});
        });

        it('should ignore white-space style if single-line truncate is true', () => {
            const props = getTextProps({ whiteSpace: WhiteSpace.pre, truncate: true });
            expect(props.style).toEqual({});
        });

        it('should keep white-space style if multi-line truncate is used', () => {
            const props = getTextProps({ whiteSpace: WhiteSpace.pre, truncate: { lines: 2 } });
            expect(props.style).toEqual({
                '--lumx-text-truncate-lines': 2,
                '--lumx-text-white-space': WhiteSpace.pre,
            });
        });
    });

    it('should merge custom styles', () => {
        const props = getTextProps({ style: { color: 'red' } });
        expect(props.style).toEqual({ color: 'red' });
    });
});
