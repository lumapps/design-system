import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen, within } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { InlineList, InlineListProps } from '.';

const CLASSNAME = InlineList.className as string;

const setup = (props: Partial<InlineListProps> = {}) => {
    render(<InlineList {...props} />);
    const inlineList = queryByClassName(document.body, CLASSNAME);
    return { props, inlineList };
};

describe(`<${InlineList.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render default', () => {
            const { inlineList } = setup({ children: ['Some text', 'Some other text'] });

            expect(inlineList).toBeInTheDocument();

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();

            const listItems = within(list).queryAllByRole('listitem');
            expect(listItems.length).toBe(2);
            expect(listItems[0]).toHaveTextContent('Some text');
            expect(listItems[1]).toHaveTextContent('Some other text');
        });

        it('should render with typography', () => {
            const { inlineList } = setup({ typography: 'body2', children: 'Some text' });
            expect(inlineList).toHaveClass('lumx-typography-body2');
        });

        it('should render with color', () => {
            const { inlineList } = setup({ color: 'blue', children: 'Some text' });
            expect(inlineList).toHaveClass('lumx-color-font-blue-N');
        });

        it('should render with color and variant', () => {
            const { inlineList } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' });
            expect(inlineList).toHaveClass('lumx-color-font-blue-D2');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'inlineList',
        forwardAttributes: 'inlineList',
    });
});
