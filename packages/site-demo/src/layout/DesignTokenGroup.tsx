import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { Theme } from '@lumx/react';

interface IDesignTokenGroup {
    /**
     * The design token group theme.
     */
    theme?: Theme;
    /**
     * The design tokens.
     */
    children?: ReactNode;
}

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IDesignTokenGroup> {}

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Theme.light,
};

/**
 * Component used to present a group of design tokens in the documentation site.
 *
 * @param props Components props.
 * @return ReactElement.
 */
const DesignTokenGroup: React.FC<IDesignTokenGroup> = ({
    theme = DEFAULT_PROPS.theme,
    children,
}: IDesignTokenGroup): ReactElement => {
    return <div className={classNames('design-token-group', `design-token-group--theme-${theme}`)}>{children}</div>;
};

export default DesignTokenGroup;
