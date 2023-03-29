import React from 'react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { ImageBlock, ImageBlockProps } from './ImageBlock';

const CLASSNAME = ImageBlock.className as string;

const setup = (props: Partial<ImageBlockProps> = {}) => {
    render(<ImageBlock {...(props as any)} />);
    const imageBlock = queryByClassName(document.body, CLASSNAME);
    return { props, imageBlock };
};

describe(`<${ImageBlock.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'imageBlock',
        forwardAttributes: 'imageBlock',
    });
});
