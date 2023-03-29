import React from 'react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { CommentBlock, CommentBlockProps } from './CommentBlock';

const CLASSNAME = CommentBlock.className as string;

const setup = (props: Partial<CommentBlockProps> = {}) => {
    render(<CommentBlock {...(props as any)} />);
    const commentBlock = queryByClassName(document.body, CLASSNAME);
    return { props, commentBlock };
};

describe(`<${CommentBlock.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'commentBlock',
        forwardAttributes: 'commentBlock',
    });
});
