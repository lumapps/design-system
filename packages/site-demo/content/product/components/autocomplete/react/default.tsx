import React from 'react';

import { Autocomplete, List, ListItem, Size } from '@lumx/react';

interface City {
    id: string;
    text: string;
}

const CITIES: City[] = [
    {
        id: 'losangeles',
        text: 'Los Angeles',
    },
    {
        id: 'sanfrancisco',
        text: 'San Francisco',
    },
    {
        id: 'paris',
        text: 'Paris',
    },
    {
        id: 'montpellier',
        text: 'Montpellier',
    },
    {
        id: 'bordeaux',
        text: 'Bordeaux',
    },
    {
        id: 'toulouse',
        text: 'Toulouse',
    },
    {
        id: 'lyon',
        text: 'Lyon',
    },
    {
        id: 'montevideo',
        text: 'Montevideo',
    },
];

export const App = ({ theme }: any) => {
    /**
     * Internal state and ref setup.
     * - `showSuggestions`: allows to control when the suggestions are displayed or not.
     * - `filterValue`: value currently displayed on the text field.
     * - `inputRef`: reference for the text field used to search suggestions
     */
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState('');
    const inputRef = React.useRef(null);

    const filteredCities = CITIES.filter((city) => {
        const noSpacesCity = city.text.replace(' ', '').toLowerCase();
        return noSpacesCity.includes(filterValue.replace(' ', '').toLowerCase());
    });

    /**
     * Callback executed when the autocomplete closes.
     * In that scenario, we need to update the internal state to `false`.
     */
    const closeAutocomplete = (): void => setShowSuggestions(false);

    /**
     * Callback triggered when a city is selected from the list. In this case, we want
     * to add the new city to set the `filterValue` to the selected city text and hide
     * the suggestions dropdown.
     * @param city City selected from the list.
     */
    const setSelectedCity = (city: City) => {
        setFilterValue(city.text);
        setShowSuggestions(false);
    };

    /**
     * Function triggered by the `onChange` event on the Text field. Here, we update the internal state
     * and set the suggestions as visible depending on whether the query is valid.
     * @param value New value entered on the text field.
     */
    const onChange = (value: string) => {
        setFilterValue(value);
        setShowSuggestions(value.length > 0);
    };

    const { activeItemIndex } = List.useKeyboardListNavigation(filteredCities, inputRef, setSelectedCity);

    /**
     * Callback triggered when the Text field is focused on. In this scenario,
     * we want to show the suggestion list if there is some text entered.
     */
    const onFocus = () => {
        setShowSuggestions(filterValue.length > 0);
    };

    const hasSuggestions = filteredCities.length > 0;

    return (
        <Autocomplete
            label="Cities"
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={closeAutocomplete}
            value={filterValue}
            onChange={onChange}
            onFocus={onFocus}
            inputRef={inputRef}
        >
            <List>
                {filteredCities.map((city, index) => {
                    const onItemSelected = () => setSelectedCity(city);
                    return (
                        <ListItem
                            size={Size.tiny}
                            key={city.id}
                            isHighlighted={index === activeItemIndex}
                            onItemSelected={onItemSelected}
                        >
                            <div>{city.text}</div>
                        </ListItem>
                    );
                })}
            </List>
        </Autocomplete>
    );
};
