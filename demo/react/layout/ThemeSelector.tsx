import React, { ChangeEvent } from 'react';

interface IProps {
    changeTheme: (theme: string) => void;
}

export const ThemeSelector = ({ changeTheme }: IProps): JSX.Element => {
    const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        changeTheme(evt.target.value);
    };

    return (
        <select onChange={handleChange}>
            <option value="lumapps">LumApps theme</option>
            <option value="material">Material theme</option>
        </select>
    );
};
