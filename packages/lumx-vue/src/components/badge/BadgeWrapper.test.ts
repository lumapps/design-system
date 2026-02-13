import { render, screen } from '@testing-library/vue';
import BaseBadgeWrapperTests, { setup } from '@lumx/core/js/components/Badge/BadgeWrapperTests';
import { CLASSNAME, BadgeWrapperProps } from '@lumx/core/js/components/Badge/BadgeWrapper';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { BadgeWrapper } from '.';

describe('<BadgeWrapper />', () => {
    const renderBadgeWrapper = ({ children, badge, ...props }: BadgeWrapperProps, options?: SetupRenderOptions<any>) =>
        render(BadgeWrapper, {
            ...options,
            props: { badge, ...props },
            slots: children ? { default: children } : undefined,
        });

    BaseBadgeWrapperTests({
        render: renderBadgeWrapper,
        screen,
    });

    const setupBadgeWrapper = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderBadgeWrapper, screen });

    commonTestsSuiteVTL(setupBadgeWrapper, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
    });
});
