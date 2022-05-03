import React from 'react';
import { Link as RouterLink } from 'gatsby';
import { Link } from '@lumx/react';

import './HomeLogoLink.scss';

export const HomeLogoLink = React.forwardRef<HTMLElement>((props, ref) => (
    <Link ref={ref as any} linkAs={RouterLink} color="dark" className="home-logo-link" to="/">
        <img src="/logo.svg" width="24px" height="24px" alt="LumX" />
        <span>
            <strong>LumApps</strong>
            {' design system'}
        </span>
    </Link>
));
HomeLogoLink.displayName = 'HomeLogoLink';
