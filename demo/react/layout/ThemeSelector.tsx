import React, { ChangeEvent, ReactElement } from 'react';

import { Theme } from '../../constants';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps {
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
const ThemeSelector: React.FC<IProps> = ({ changeTheme }: IProps): ReactElement => {
    /**
     * When the select is changed, call the function to change the theme.
     *
     * @param evt The change event of the select element.
     */
    const handleChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void = (
        evt: ChangeEvent<HTMLSelectElement>,
    ): void => {
        changeTheme(evt.target.value as Theme);
    };

    return (
        <select onChange={handleChange}>
            <option value="lumapps">LumApps theme</option>
            <option value="material">Material theme</option>
        </select>
    );
};

/////////////////////////////

export { ThemeSelector };
