import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { PostBlock, PostBlockProps } from './PostBlock';

const CLASSNAME = PostBlock.className as string;

const setup = (props: Partial<PostBlockProps> = {}) => {
    render(<PostBlock {...(props as any)} />);
    const postBlock = queryByClassName(document.body, CLASSNAME);
    return { props, postBlock };
};

describe(`<${PostBlock.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'postBlock',
        forwardAttributes: 'postBlock',
    });
});
