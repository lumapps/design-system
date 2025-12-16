import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { ListDivider, ListDividerProps } from './ListDivider';

const CLASSNAME = ListDivider.className as string;

const setup = (props: Partial<ListDividerProps> = {}) => {
    render(<ListDivider {...(props as any)} />);
    const listDivider = queryByClassName(document.body, CLASSNAME);
    return { props, listDivider };
};

describe(`<${ListDivider.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listDivider',
        forwardAttributes: 'listDivider',
    });
});
