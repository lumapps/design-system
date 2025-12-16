import classNames from 'classnames';
import { ReactNode, useState } from 'react';

import { ExpansionPanel, Theme } from '@lumx/react';

import './DesignToken.scss';

interface DesignTokenProps {
    /** The design token name. */
    name: string;
    /** The design token prefix. */
    prefix?: ReactNode;
    /** The design token description. */
    description?: string;
    /** Value of the token */
    value?: string;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** The design token demo. */
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
    value,
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
            toggleButtonProps={{ label: 'Toggle' }}
        >
            <header>
                <div className="design-token__header">
                    {prefix && <div className="design-token__prefix">{prefix}</div>}
                    <span className="design-token__name">{name}</span>
                    <span className="design-token__value">{value}</span>
                </div>
            </header>

            <div className="design-token__content">
                {description && <p className="design-token__description">{description}</p>}
                <div className="design-token__demo">{children}</div>
            </div>
        </ExpansionPanel>
    );
};
