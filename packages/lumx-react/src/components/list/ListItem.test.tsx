import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ListItem, ListItemProps } from './ListItem';

const CLASSNAME = ListItem.className as string;

const setup = (props: Partial<ListItemProps> = {}) => {
    render(<ListItem {...(props as any)} />);
    const listItem = queryByClassName(document.body, CLASSNAME);
    return { props, listItem };
};

describe(`<${ListItem.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listItem',
        forwardAttributes: 'listItem',
    });
});
