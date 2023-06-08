import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { Lightbox, LightboxProps } from './Lightbox';

const CLASSNAME = Lightbox.className as string;

const setup = (props: Partial<LightboxProps> = {}) => {
    const propsOverride = { isOpen: true, ...props } as any;
    const { container } = render(<Lightbox {...propsOverride} />);
    const lightbox = queryByClassName(document.body, CLASSNAME);
    return { props, container, lightbox };
};

describe(`<${Lightbox.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'lightbox',
        forwardAttributes: 'lightbox',
        forwardRef: 'lightbox',
    });
});
