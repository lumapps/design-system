import { Theme, ThemeContext } from '@lumx/demo/context/theme';
import React, { ChangeEvent, ReactElement, useContext } from 'react';

import { Chip, Size } from '@lumx/react';

/**
 * The theme selector component.
 * Display a select with the list of all available themes.
 * When a theme is selected, update the theme throughout the demo site and the components being demoed.
 *
 * @return The theme selector component.
 */
export const ThemeSelector: React.FC = (): ReactElement => {
    const { theme, changeTheme } = useContext(ThemeContext);

    /**
     * When the select is changed, call the function to change the theme.
     *
     * @param evt The change event of the select element.
     */
    const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        changeTheme?.((evt.target.textContent || '').toLocaleLowerCase() as Theme);
    };

    return (
        <>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={theme === Theme.lumapps}
                size={Size.s}
                onClick={handleChange}
            >
                LumApps
            </Chip>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={theme === Theme.material}
                size={Size.s}
                onClick={handleChange}
            >
                Material
            </Chip>
        </>
    );
};
