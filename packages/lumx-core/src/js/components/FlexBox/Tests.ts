import { Orientation, Size } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { FlexBoxProps, CLASSNAME } from '.';

type SetupProps = Partial<FlexBoxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (props: SetupProps = {}, { render, ...options }: SetupOptions<FlexBoxProps>) => {
    const { container } = render(props, options);
    const flexBox = getByClassName(container, CLASSNAME);
    return { props, flexBox, container };
};

export default (renderOptions: SetupOptions<FlexBoxProps>) => {
    describe('Props', () => {
        it('should render default', () => {
            const { flexBox } = setup({}, renderOptions);
            expect(flexBox).toBeInTheDocument();
            expect(flexBox).toHaveClass(CLASSNAME);
        });

        it('should apply fillSpace class', () => {
            const { flexBox } = setup({ fillSpace: true }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--fill-space`);
        });

        it('should apply wrap class', () => {
            const { flexBox } = setup({ wrap: true }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--wrap`);
        });

        it('should apply noShrink class', () => {
            const { flexBox } = setup({ noShrink: true }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--no-shrink`);
        });

        it('should apply gap class', () => {
            const { flexBox } = setup({ gap: Size.big }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--gap-big`);
        });

        it('should apply orientation class', () => {
            const { flexBox } = setup({ orientation: Orientation.vertical }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--orientation-vertical`);
        });

        it('should apply vertical alignment class', () => {
            const { flexBox } = setup({ vAlign: 'center' }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--v-align-center`);
        });

        it('should apply horizontal alignment class', () => {
            const { flexBox } = setup({ hAlign: 'center' }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--h-align-center`);
        });

        it('should apply marginAuto classes (single)', () => {
            const { flexBox } = setup({ marginAuto: 'left' }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-left`);
        });

        it('should apply marginAuto classes (multiple)', () => {
            const { flexBox } = setup({ marginAuto: ['left', 'top'] }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-left`);
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-top`);
        });

        it('should default to horizontal orientation when hAlign is set', () => {
            const { flexBox } = setup({ hAlign: 'center' }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--orientation-horizontal`);
        });

        it('should default to horizontal orientation when vAlign is set', () => {
            const { flexBox } = setup({ vAlign: 'center' }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--orientation-horizontal`);
        });

        it('should default to horizontal orientation when wrap is set', () => {
            const { flexBox } = setup({ wrap: true }, renderOptions);
            expect(flexBox).toHaveClass(`${CLASSNAME}--orientation-horizontal`);
        });
    });
};
