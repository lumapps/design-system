import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { List, ListProps } from './List';

const CLASSNAME = List.className as string;

const setup = (props: Partial<ListProps> = {}) => {
    render(<List {...(props as any)} />);
    const list = queryByClassName(document.body, CLASSNAME);
    return { props, list };
};

describe(`<${List.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'list', forwardAttributes: 'list' });
});
