import { render, screen } from '@testing-library/vue';

import BaseIconTests, { setup } from '@lumx/core/js/components/Icon/Tests';
import { IconClassName, IconProps } from '@lumx/core/js/components/Icon';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Icon } from '.';

describe('<Icon />', () => {
    const renderIcon = (props: IconProps, options?: SetupRenderOptions<IconProps>) =>
        render(Icon, { ...options, props });

    BaseIconTests({ render: renderIcon, screen });

    const setupIcon = (props: Partial<IconProps> = {}, options: SetupRenderOptions<IconProps> = {}) =>
        setup(props, { ...options, render: renderIcon, screen });

    // Common tests suite.
    commonTestsSuiteVTL(setupIcon, {
        baseClassName: IconClassName,
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
