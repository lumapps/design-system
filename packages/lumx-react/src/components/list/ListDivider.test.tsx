import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import BaseListDividerTests from '@lumx/core/js/components/List/ListDividerTests';
import { ListDivider, ListDividerProps } from './ListDivider';

const CLASSNAME = ListDivider.className as string;

const setup = (props: Partial<ListDividerProps> = {}) => {
    render(<ListDivider {...(props as any)} />);
    const listDivider = queryByClassName(document.body, CLASSNAME);
    return { props, listDivider };
};

describe(`<${ListDivider.displayName}>`, () => {
    // Run core tests
    BaseListDividerTests({
        render: (props: ListDividerProps) => render(<ListDivider {...(props as any)} />),
        screen,
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listDivider',
        forwardAttributes: 'listDivider',
    });
});
