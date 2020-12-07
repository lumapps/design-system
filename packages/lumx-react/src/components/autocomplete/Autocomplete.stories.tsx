import React, { useMemo, useRef, useState } from 'react';

import { Autocomplete, List, ListItem, Size } from '@lumx/react';

import { CITIES } from './__mockData__';

export default { title: 'LumX components/autocomplete/Autocomplete' };

const cityNames = CITIES.map((city) => city.text);

export const Simple = ({ theme }: any) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    const filteredCities = useMemo(
        () =>
            cityNames.filter((city) => {
                const noSpacesCity = city.replace(' ', '').toLowerCase();
                return noSpacesCity.includes(value.replace(' ', '').toLowerCase());
            }),
        [value],
    );

    const close = () => setShowSuggestions(false);

    const setSelectedCity = (city: string) => {
        setValue(city);
        setShowSuggestions(false);
    };
    const selectItem = (city: string) => () => setSelectedCity(city);

    const onChange = (newValue: string) => {
        setValue(newValue);
        setShowSuggestions(newValue.length > 0);
    };

    const { activeItemIndex } = List.useKeyboardListNavigation(filteredCities, inputRef, setSelectedCity);

    const onFocus = () => setShowSuggestions(value.length > 0);

    const hasSuggestions = filteredCities.length > 0;

    return (
        <Autocomplete
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={close}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            inputRef={inputRef}
        >
            {hasSuggestions && (
                <List isClickable>
                    {filteredCities.map((city, index) => (
                        <ListItem
                            size={Size.tiny}
                            key={city}
                            isHighlighted={index === activeItemIndex}
                            onItemSelected={selectItem(city)}
                        >
                            <div>{city}</div>
                        </ListItem>
                    ))}
                </List>
            )}
        </Autocomplete>
    );
};
