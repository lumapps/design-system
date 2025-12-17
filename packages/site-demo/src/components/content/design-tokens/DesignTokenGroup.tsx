import classNames from 'classnames';
import { ReactNode } from 'react';

import { Theme } from '@lumx/react';

import './DesignTokenGroup.scss';

interface DesignTokenGroupProps {
    /** Theme adapting the component to light or dark background. */
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
