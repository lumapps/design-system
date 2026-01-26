import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ListSubheader, ListSubheaderProps } from './ListSubheader';

const CLASSNAME = ListSubheader.className as string;

const setup = (props: Partial<ListSubheaderProps> = {}) => {
    const propsOverride = {
        children: 'Subheader',
        ...props,
    };
    render(<ListSubheader {...(propsOverride as any)} />);
    const listSubheader = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, listSubheader };
};

describe(`<${ListSubheader.displayName}>`, () => {
    describe('Props', () => {
        it('should render children', () => {
            setup({ children: 'My Subheader' });
            expect(screen.getByText('My Subheader')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listSubheader',
        forwardAttributes: 'listSubheader',
    });
});
