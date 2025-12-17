import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ListSubheader, ListSubheaderProps } from './ListSubheader';

const CLASSNAME = ListSubheader.className as string;

const setup = (props: Partial<ListSubheaderProps> = {}) => {
    render(<ListSubheader {...(props as any)} />);
    const listSubheader = queryByClassName(document.body, CLASSNAME);
    return { props, listSubheader };
};

describe(`<${ListSubheader.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listSubheader',
        forwardAttributes: 'listSubheader',
    });
});
