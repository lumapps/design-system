import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import omit from 'lodash/omit';
import last from 'lodash/last';

import { mdiAccount, mdiHeart } from '@lumx/icons';
import { Badge, BadgeWrapper, BadgeWrapperProps, ColorPalette, Icon } from '@lumx/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import BaseBadgeWrapperTests from '@lumx/core/js/components/Badge/BadgeWrapperTests';

const CLASSNAME = BadgeWrapper.className as string;

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
    BaseBadgeWrapperTests({
        render: (props: any) =>
            render(<BadgeWrapper {...(omit(props, 'children') as any)}>{props.children}</BadgeWrapper>),
        screen,
    });

    describe('React', () => {
        it('should render badge with JSX components', () => {
            const { badgeWrapper } = setup();

            expect(badgeWrapper).toHaveClass('lumx-badge-wrapper');
            expect(badgeWrapper.children).toHaveLength(2);
            expect(last(badgeWrapper.children)).toHaveClass('lumx-badge-wrapper__badge');
        });

        it('should render JSX children content', () => {
            setup({ children: <div data-testid="child">Child Content</div> });
            expect(screen.getByTestId('child')).toBeInTheDocument();
            expect(screen.getByText('Child Content')).toBeInTheDocument();
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'badgeWrapper',
        forwardAttributes: 'badgeWrapper',
        forwardRef: 'badgeWrapper',
    });
});
