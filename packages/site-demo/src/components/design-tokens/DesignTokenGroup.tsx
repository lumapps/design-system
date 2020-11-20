import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { Theme } from '@lumx/react';

interface DesignTokenGroupProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The design tokens. */
    children?: ReactNode;
}

/**
 * Component used to present a group of design tokens in the documentation site.
 *
 * @param props Components props.
 * @return ReactElement.
 */
export const DesignTokenGroup: React.FC<DesignTokenGroupProps> = ({ theme = Theme.light, children }) => {
    return <div className={classNames('design-token-group', `design-token-group--theme-${theme}`)}>{children}</div>;
};
