import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Size } from '@lumx/react';
import { List, ListProps } from './List';

const CLASSNAME = List.className as string;

const setup = (props: Partial<ListProps> = {}) => {
    const propsOverride = {
        children: <li>Item</li>,
        ...props,
    };
    render(<List {...(propsOverride as any)} />);
    const list = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, list };
};

describe(`<${List.displayName}>`, () => {
    describe('Props', () => {
        it('should render children', () => {
            setup({ children: <li data-testid="item">My Item</li> });
            expect(screen.getByTestId('item')).toBeInTheDocument();
        });

        it('should apply itemPadding class', () => {
            const { list } = setup({ itemPadding: Size.big });
            expect(list).toHaveClass(`${CLASSNAME}--item-padding-big`);
        });

        it('should apply tabIndex', () => {
            const { list } = setup({ tabIndex: 0 });
            expect(list).toHaveAttribute('tabindex', '0');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'list', forwardAttributes: 'list' });
});
