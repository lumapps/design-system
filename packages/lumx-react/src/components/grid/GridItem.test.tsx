import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { GridItem, GridItemProps } from './GridItem';

const CLASSNAME = GridItem.className as string;

const setup = (propsOverride: Partial<GridItemProps> = {}) => {
    const props: GridItemProps = {
        children: <div />,
        ...propsOverride,
    };
    render(<GridItem {...props} />);
    const gridItem = getByClassName(document.body, CLASSNAME);
    return { props, gridItem };
};

describe(`<${GridItem.displayName}>`, () => {
    describe('Props', () => {
        it('should apply width class', () => {
            const { gridItem } = setup({ width: '6' });
            expect(gridItem).toHaveClass(`${CLASSNAME}--width-6`);
        });

        it('should apply align class', () => {
            const { gridItem } = setup({ align: 'center' });
            expect(gridItem).toHaveClass(`${CLASSNAME}--align-center`);
        });

        it('should apply order class', () => {
            const { gridItem } = setup({ order: '2' });
            expect(gridItem).toHaveClass(`${CLASSNAME}--order-2`);
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'gridItem',
        forwardAttributes: 'gridItem',
        forwardRef: 'gridItem',
    });
});
