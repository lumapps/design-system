import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { PostBlock, PostBlockProps } from './PostBlock';

const CLASSNAME = PostBlock.className as string;

const setup = (props: Partial<PostBlockProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<PostBlock {...(props as any)} />, { wrapper });
    const postBlock = queryByClassName(document.body, CLASSNAME);
    return { props, postBlock };
};

describe(`<${PostBlock.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'postBlock',
        forwardAttributes: 'postBlock',
        applyTheme: {
            affects: [{ element: 'postBlock' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
