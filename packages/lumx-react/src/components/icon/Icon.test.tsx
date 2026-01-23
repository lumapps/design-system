import { render, screen } from '@testing-library/react';

import BaseIconTests, { setup } from '@lumx/core/js/components/Icon/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { Icon, IconProps } from './Icon';

const CLASSNAME = Icon.className as string;

describe(`<${Icon.displayName}>`, () => {
    const renderIcon = (props: IconProps, options?: SetupRenderOptions) => render(<Icon {...props} />, options);

    BaseIconTests({ render: renderIcon, screen });

    const setupIcon = (props: Partial<IconProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderIcon, screen });

    // Common tests suite.
    commonTestsSuiteRTL(setupIcon, {
        baseClassName: CLASSNAME,
        forwardClassName: 'i',
        forwardAttributes: 'i',
        forwardRef: 'i',
        applyTheme: {
            affects: [{ element: 'i', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
        },
    });
});
