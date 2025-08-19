import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import React from 'react';

import omit from 'lodash/omit';
import last from 'lodash/last';

import { mdiAccount, mdiHeart } from '@lumx/icons';
import { Badge, BadgeWrapper, BadgeWrapperProps, ColorPalette, Icon } from '@lumx/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

const CLASSNAME = BadgeWrapper.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<BadgeWrapperProps> = {}) => {
    const props = {
        badge: (
            <Badge color={ColorPalette.red}>
                <Icon icon={mdiHeart} />
            </Badge>
        ),
        children: <Icon icon={mdiAccount} />,
        ...propsOverride,
    };
    render(<BadgeWrapper {...omit(props, 'children')}>{props.children}</BadgeWrapper>);
    const badgeWrapper = getByClassName(document.body, CLASSNAME);
    return { badgeWrapper, props };
};

describe(`<${BadgeWrapper.displayName}>`, () => {
    describe('Props', () => {
        it('should render badge', () => {
            const { badgeWrapper } = setup();

            expect(badgeWrapper).toHaveClass('lumx-badge-wrapper');
            expect(badgeWrapper.children).toHaveLength(2);
            expect(last(badgeWrapper.children)).toHaveClass('lumx-badge-wrapper__badge');
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'badgeWrapper',
        forwardAttributes: 'badgeWrapper',
        forwardRef: 'badgeWrapper',
    });
});
