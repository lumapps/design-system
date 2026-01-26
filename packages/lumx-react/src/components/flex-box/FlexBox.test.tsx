import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Orientation, Size } from '@lumx/core/js/constants';
import { FlexBox, FlexBoxProps } from './FlexBox';

const CLASSNAME = FlexBox.className as string;

type SetupProps = Partial<FlexBoxProps>;

const setup = (propsOverride: SetupProps = {}) => {
    const props: FlexBoxProps = {
        children: null,
        ...propsOverride,
    };
    render(<FlexBox {...props} />);
    const flexBox = queryByClassName(document.body, CLASSNAME);
    return { props, flexBox };
};

describe(`<${FlexBox.displayName}>`, () => {
    describe('Props', () => {
        it('should render as a different element', () => {
            const { container } = render(<FlexBox as="section" />);
            expect(container.querySelector('section')).toBeInTheDocument();
        });

        it('should apply fillSpace class', () => {
            const { flexBox } = setup({ fillSpace: true });
            expect(flexBox).toHaveClass(`${CLASSNAME}--fill-space`);
        });

        it('should apply wrap class', () => {
            const { flexBox } = setup({ wrap: true });
            expect(flexBox).toHaveClass(`${CLASSNAME}--wrap`);
        });

        it('should apply noShrink class', () => {
            const { flexBox } = setup({ noShrink: true });
            expect(flexBox).toHaveClass(`${CLASSNAME}--no-shrink`);
        });

        it('should apply gap class', () => {
            const { flexBox } = setup({ gap: Size.big });
            expect(flexBox).toHaveClass(`${CLASSNAME}--gap-big`);
        });

        it('should apply orientation class', () => {
            const { flexBox } = setup({ orientation: Orientation.vertical });
            expect(flexBox).toHaveClass(`${CLASSNAME}--orientation-vertical`);
        });

        it('should apply vertical alignment class', () => {
            const { flexBox } = setup({ vAlign: 'center' });
            expect(flexBox).toHaveClass(`${CLASSNAME}--v-align-center`);
        });

        it('should apply horizontal alignment class', () => {
            const { flexBox } = setup({ hAlign: 'center' });
            expect(flexBox).toHaveClass(`${CLASSNAME}--h-align-center`);
        });

        it('should apply marginAuto classes (single)', () => {
            const { flexBox } = setup({ marginAuto: 'left' });
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-left`);
        });

        it('should apply marginAuto classes (multiple)', () => {
            const { flexBox } = setup({ marginAuto: ['left', 'top'] });
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-left`);
            expect(flexBox).toHaveClass(`${CLASSNAME}--margin-auto-top`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'flexBox', forwardAttributes: 'flexBox' });
});
