import classNames from 'classnames';
import React, { ReactElement, ReactNode, useState } from 'react';

import { ExpansionPanel, Theme } from '@lumx/react';

interface IDesignToken {
    /**
     * The design token name.
     */
    name: string;
    /**
     * The design token prefix.
     */
    prefix: ReactNode;
    /**
     * The design token description.
     */
    description?: string;
    /**
     * From which version the design token is available.
     */
    version?: string;
    /**
     * The design token theme.
     */
    theme?: Theme;
    /**
     * The design token demo.
     */
    children?: ReactNode;
}

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IDesignToken> {}

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Theme.light,
};

/**
 * Component used to present a design token in the documentation site.
 *
 * @param props Components props.
 * @return ReactElement.
 */
const DesignToken: React.FC<IDesignToken> = ({
    name,
    prefix,
    description,
    version,
    theme = DEFAULT_PROPS.theme,
    children,
}: IDesignToken): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ExpansionPanel
            className={classNames('design-token', `design-token--theme-${theme}`)}
            hasBackground
            hasHeaderDivider
            isOpen={isOpen}
            toggleCallback={setIsOpen}
            theme={theme}
        >
            <header className="design-token__header">
                <div className="design-token__prefix">{prefix}</div>
                <span className="design-token__name">{name}</span>
                <span className="design-token__version">{version}</span>
            </header>

            <div className="design-token__content">
                <p className="design-token__description">{description}</p>
                <div className="design-token__demo">{children}</div>
            </div>
        </ExpansionPanel>
    );
};

export default DesignToken;
