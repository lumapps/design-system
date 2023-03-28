import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

const CLASSNAME = Thumbnail.className as string;

const setup = (props: Partial<ThumbnailProps> = {}) => {
    render(<Thumbnail {...(props as any)} />);
    const thumbnail = queryByClassName(document.body, CLASSNAME);
    return { props, thumbnail };
};

describe(`<${Thumbnail.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thumbnail',
        forwardAttributes: 'thumbnail',
    });
});
