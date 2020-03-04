import React, { useMemo } from 'react';

import { AutocompleteMultiple, Chip, ChipGroup, Icon, List, ListItem, Size } from '@lumx/react';

import { mdiClose } from '@lumx/icons';

export default { title: 'Autocomplete Multiple' };

import { CITIES } from './__mockData__';

interface City {
    id: string;
    text: string;
}

export const simple = ({ theme }: any) => {
    const INITIAL_STATE_SHOW_SUGGESTIONS = false;
    const INITIAL_STATE_NAVIGATION_SUGGESTION = '';

    const [showSuggestions, setShowSuggestions] = React.useState(INITIAL_STATE_SHOW_SUGGESTIONS);
    const [filterValue, setFilterValue] = React.useState('');
    const [navigationSuggestionValue, setNavigationSuggestionValue] = React.useState(
        INITIAL_STATE_NAVIGATION_SUGGESTION,
    );
    const [selectedValues, setSelectedValues] = React.useState<City[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredCities = useMemo(
        () =>
            CITIES.filter((city) => {
                const noSpacesCity = city.text.replace(' ', '').toLowerCase();
                return noSpacesCity.includes(filterValue.replace(' ', '').toLowerCase());
            }),
        [filterValue],
    );

    const hasSuggestions = filteredCities.length > 0;

    const onChipDeleted = () => {
        selectedValues.pop();
        setSelectedValues(selectedValues);
    };

    const {
        activeChip,
        onBackspacePressed: chipBackspaceNavigation,
        resetChipNavigation,
    } = ChipGroup.useChipGroupNavigation(selectedValues, onChipDeleted);

    const closeAutocomplete = () => {
        setShowSuggestions(false);
        resetChipNavigation();
    };

    const setSelectedCity = (city: City) => {
        setSelectedValues([...selectedValues, city]);
        setFilterValue('');
        setShowSuggestions(INITIAL_STATE_SHOW_SUGGESTIONS);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
    };

    const onNewCityCreated = (newCity: string) => {
        if (!newCity || newCity.length <= 0) {
            return;
        }

        setSelectedCity({
            id: newCity.replace(' ', '').toLowerCase(),
            text: newCity,
        });
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
    };

    const clearSelectedValue = (city: City) => () => {
        inputRef?.current?.focus();
        setSelectedValues(city ? selectedValues.filter((c) => c.id !== city.id) : []);
    };

    const onChange = (value: string) => {
        setFilterValue(value);
        setShowSuggestions(value.length > 0);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
        resetChipNavigation();
    };

    const onItemNavigated = (city: City) => {
        if (city && showSuggestions) {
            setNavigationSuggestionValue(city.text);
        }
    };

    const isTextFieldEmpty = () => filterValue.length === 0 && !navigationSuggestionValue;

    const onBackspacePressed = () => {
        if (isTextFieldEmpty()) {
            chipBackspaceNavigation();
        } else if (navigationSuggestionValue) {
            onChange(navigationSuggestionValue);
            setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
            resetChipNavigation();
        }
    };

    const { activeItemIndex } = List.useKeyboardListNavigation(
        filteredCities,
        inputRef,
        setSelectedCity,
        onItemNavigated,
        onNewCityCreated,
        onBackspacePressed,
        true,
    );

    const onFocus = () => {
        setShowSuggestions(filterValue.length > 0);
    };

    const onBlur = () => {
        resetChipNavigation();
    };

    const renderChip = (city: City, index: number) => (
        <Chip
            theme={theme}
            isClickable
            key={index}
            after={<Icon icon={mdiClose} size={Size.xxs} />}
            size={Size.s}
            onAfterClick={clearSelectedValue(city)}
            onClick={clearSelectedValue(city)}
            isHighlighted={index === activeChip}
        >
            {city.text}
        </Chip>
    );

    return (
        <AutocompleteMultiple
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={closeAutocomplete}
            value={navigationSuggestionValue || filterValue}
            onChange={onChange}
            onFocus={onFocus}
            values={selectedValues}
            inputRef={inputRef}
            shouldFocusOnClose
            fitToAnchorWidth={true}
            onBlur={onBlur}
            selectedChipRender={renderChip}
        >
            <List isClickable theme={theme}>
                {filteredCities.map((city, index) => {
                    const onItemSelected = () => setSelectedCity(city);
                    return (
                        <ListItem
                            size={Size.tiny}
                            theme={theme}
                            key={city.id}
                            isHighlighted={index === activeItemIndex}
                            onItemSelected={onItemSelected}
                        >
                            {city.text}
                        </ListItem>
                    );
                })}
            </List>
        </AutocompleteMultiple>
    );
};
