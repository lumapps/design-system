import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

const CLASSNAME = Thumbnail.className as string;

const setup = (props: Partial<ThumbnailProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<Thumbnail {...(props as any)} />, { wrapper });
    const thumbnail = queryByClassName(document.body, CLASSNAME);
    return { props, thumbnail };
};

describe(`<${Thumbnail.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thumbnail',
        forwardAttributes: 'thumbnail',
        applyTheme: {
            affects: [{ element: 'thumbnail' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
