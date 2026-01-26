import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Orientation, Size } from '@lumx/react';

import { Grid, GridProps } from './Grid';

const CLASSNAME = Grid.className as string;

const setup = (propsOverride: Partial<GridProps> = {}) => {
    const props: GridProps = {
        children: <div />,
        ...propsOverride,
    };
    render(<Grid {...props} />);
    const grid = getByClassName(document.body, `${CLASSNAME}-container`);
    return { props, grid };
};

describe(`<${Grid.displayName}>`, () => {
    describe('Props', () => {
        it('should apply orientation class', () => {
            const { grid } = setup({ orientation: Orientation.vertical });
            expect(grid).toHaveClass(`${CLASSNAME}--orientation-vertical`);
        });

        it('should apply wrap class', () => {
            const { grid } = setup({ wrap: 'wrap' });
            expect(grid).toHaveClass(`${CLASSNAME}--wrap-wrap`);
        });

        it('should apply vertical alignment class', () => {
            const { grid } = setup({ vAlign: 'center' });
            expect(grid).toHaveClass(`${CLASSNAME}--v-align-center`);
        });

        it('should apply horizontal alignment class', () => {
            const { grid } = setup({ hAlign: 'center' });
            expect(grid).toHaveClass(`${CLASSNAME}--h-align-center`);
        });

        it('should apply gutter class', () => {
            const { grid } = setup({ gutter: Size.big });
            expect(grid).toHaveClass(`${CLASSNAME}--gutter-big`);
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: `${CLASSNAME}-container`,
        forwardClassName: 'grid',
        forwardAttributes: 'grid',
        forwardRef: 'grid',
    });
});
