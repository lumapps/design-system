import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';

import { ExpansionPanel, Theme } from '@lumx/react';

interface DesignTokenProps {
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
 * Component used to present a design token in the documentation site.
 *
 * @param props Components props.
 * @return ReactElement.
 */
export const DesignToken: React.FC<DesignTokenProps> = ({
    name,
    prefix,
    description,
    version,
    theme = Theme.light,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ExpansionPanel
            className={classNames('design-token', `design-token--theme-${theme}`)}
            hasBackground
            hasHeaderDivider
            isOpen={isOpen}
            onToggleOpen={setIsOpen}
            theme={theme}
        >
            <header>
                <div className="design-token__header">
                    <div className="design-token__prefix">{prefix}</div>
                    <span className="design-token__name">{name}</span>
                    <span className="design-token__version">{version}</span>
                </div>
            </header>

            <div className="design-token__content">
                <p className="design-token__description">{description}</p>
                <div className="design-token__demo">{children}</div>
            </div>
        </ExpansionPanel>
    );
};
