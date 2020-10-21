import React, { ChangeEvent, ReactElement, useContext } from 'react';

import { GlobalTheme } from '@lumx/core/js/types';
import { GlobalThemeContext } from '@lumx/demo/global-theme';
import { Chip, Size } from '@lumx/react';

/**
 * The theme selector component.
 * Display a select with the list of all available themes.
 * When a theme is selected, update the theme throughout the demo site and the components being demoed.
 *
 * @return The theme selector component.
 */
export const GlobalThemeSelector: React.FC = (): ReactElement => {
    const { globalTheme, changeGlobalTheme } = useContext(GlobalThemeContext);

    /**
     * When the select is changed, call the function to change the theme.
     *
     * @param evt The change event of the select element.
     */
    const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        changeGlobalTheme?.((evt.target.textContent || '').toLocaleLowerCase() as GlobalTheme);
    };

    return (
        <>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={globalTheme === 'material'}
                size={Size.s}
                onClick={handleChange}
            >
                Material
            </Chip>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={globalTheme === 'lumapps'}
                size={Size.s}
                onClick={handleChange}
            >
                LumApps
            </Chip>
        </>
    );
};
