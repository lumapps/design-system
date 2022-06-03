import React from 'react';
import { Link as RouterLink } from 'gatsby';
import { Link } from '@lumx/react';

import './HomeLogoLink.scss';
import classNames from 'classnames';

interface HomeLogoLinkProps {
    className?: string;
}

export const HomeLogoLink = React.forwardRef<HTMLElement, HomeLogoLinkProps>(({ className }, ref) => (
    <Link ref={ref as any} linkAs={RouterLink} color="dark" className={classNames(className, 'home-logo-link')} to="/">
        <img src="/logo.svg" width="24px" height="24px" alt="LumX" />
        <span>
            <strong>LumApps</strong>
            {' design system'}
        </span>
    </Link>
));
HomeLogoLink.displayName = 'HomeLogoLink';
