import React, { ChangeEvent, ReactElement } from 'react';

import { Chip, Size } from 'LumX';

import { Theme } from 'LumX/demo/constants';

import { IGenericProps } from 'LumX/core/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The current selected theme.
     */
    theme: Theme;
    /**
     * The function to change the theme.
     * When the theme selector is used, this function is called to update the current theme.
     */
    changeTheme(theme: Theme): void;
}

/////////////////////////////

/**
 * The theme selector component.
 * Display a select with the list of all available themes.
 * When a theme is selected, update the theme throughout the demo site and the components being demoed.
 *
 * @return The theme selector component.
 */
const ThemeSelector: React.FC<IProps> = ({ changeTheme, theme }: IProps): ReactElement => {
    /**
     * When the select is changed, call the function to change the theme.
     *
     * @param evt The change event of the select element.
     */
    const handleChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void = (
        evt: ChangeEvent<HTMLSelectElement>,
    ): void => {
        changeTheme((evt.target.textContent || '').toLocaleLowerCase() as Theme);
    };

    return (
        <>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={theme === 'lumapps'}
                size={Size.s}
                onClick={handleChange}
            >
                LumApps
            </Chip>
            <Chip
                className="lumx-spacing-margin-right-tiny"
                isSelected={theme === 'material'}
                size={Size.s}
                onClick={handleChange}
            >
                Material
            </Chip>
        </>
    );
};

/////////////////////////////

export { ThemeSelector };
