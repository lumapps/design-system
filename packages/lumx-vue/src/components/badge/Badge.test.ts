import { render, screen } from '@testing-library/vue';
import BaseBadgeTests, { setup } from '@lumx/core/js/components/Badge/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Badge';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Badge } from '.';

describe('<Badge />', () => {
    const renderBadge = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Badge, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseBadgeTests({
        render: renderBadge,
        screen,
    });

    const setupBadge = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderBadge, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupBadge, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
    });
});
