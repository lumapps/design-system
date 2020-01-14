import React from 'react';

import { Autocomplete, List, ListItem, Size } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'Autocomplete', decorators };

const CITIES = [
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

export const simple = ({ theme }) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState('');
    const inputRef = React.useRef(null);

    const filteredCities = CITIES.filter((city) => {
        const noSpacesCity = city.text.replace(' ', '').toLowerCase();
        return noSpacesCity.includes(filterValue.replace(' ', '').toLowerCase());
    });

    const closeAutocomplete = () => setShowSuggestions(false);

    const setSelectedCity = (city) => {
        setFilterValue(city.text);
        setShowSuggestions(false);
    };

    const onChange = (value) => {
        setFilterValue(value);
        setShowSuggestions(value.length > 0);
    };

    const { activeItemIndex } = List.useKeyboardListNavigation(filteredCities, inputRef, setSelectedCity);

    const onFocus = () => {
        setShowSuggestions(filterValue.length > 0);
    };

    const hasSuggestions = filteredCities.length > 0;

    return (
        <Autocomplete
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={closeAutocomplete}
            value={filterValue}
            onChange={onChange}
            onFocus={onFocus}
            inputRef={inputRef}
        >
            {hasSuggestions && (
                <List isClickable>
                    {filteredCities.map((city, index) => (
                        <ListItem
                            size={Size.tiny}
                            key={city.id}
                            isHighlighted={index === activeItemIndex}
                            onItemSelected={() => setSelectedCity(city)}
                        >
                            <div>{city.text}</div>
                        </ListItem>
                    ))}
                </List>
            )}
        </Autocomplete>
    );
};
