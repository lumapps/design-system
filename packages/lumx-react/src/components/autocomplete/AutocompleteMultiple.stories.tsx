import React from 'react';

import { AutocompleteMultiple, Chip, ChipGroup, Icon, List, ListItem, Size } from '@lumx/react';

import { mdiClose } from '@lumx/icons';

import { decorators } from '@lumx/react/story-block';

export default { title: 'Autocomplete Multiple', decorators };

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

interface ICity {
    id: string;
    text: string;
}

export const simple = ({ theme }) => {
    const INITIAL_STATE_SHOW_SUGGESTIONS = false;
    const INITIAL_STATE_NAVIGATION_SUGGESTION = undefined;

    const [showSuggestions, setShowSuggestions] = React.useState(INITIAL_STATE_SHOW_SUGGESTIONS);
    const [filterValue, setFilterValue] = React.useState('');
    const [navigationSuggestionValue, setNavigationSuggestionValue] = React.useState(
        INITIAL_STATE_NAVIGATION_SUGGESTION,
    );
    const [selectedValues, setSelectedValues] = React.useState<ICity[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredCities = CITIES.filter((city) => {
        const noSpacesCity = city.text.replace(' ', '').toLowerCase();
        return noSpacesCity.includes(filterValue.replace(' ', '').toLowerCase());
    });

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

    const setSelectedCity = (city) => {
        setSelectedValues([...selectedValues, city]);
        setFilterValue('');
        setShowSuggestions(INITIAL_STATE_SHOW_SUGGESTIONS);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
    };

    const onNewCityCreated = (newCity) => {
        if (newCity && newCity.length > 0) {
            setSelectedCity({
                id: newCity.replace(' ', '').toLowerCase(),
                text: newCity,
            });

            setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
        }
    };

    const clearSelectedValue = (event, city) => {
        inputRef?.current?.focus();
        setSelectedValues(city ? selectedValues.filter((c) => c.id !== city.id) : []);
    };

    const onChange = (value) => {
        setFilterValue(value);
        setShowSuggestions(value.length > 0);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
        resetChipNavigation();
    };

    const onItemNavigated = (city) => {
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

    const renderChip = (city, index) => (
        <Chip
            theme={theme}
            isClickable
            key={index}
            after={<Icon icon={mdiClose} size={Size.xxs} />}
            size={Size.s}
            onAfterClick={(event) => clearSelectedValue(event, city)}
            onClick={(event) => clearSelectedValue(event, city)}
            isHighlighted={index === activeChip}
        >
            {city.text}
        </Chip>
    );

    return (
        <AutocompleteMultiple
            anchorToInput
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={closeAutocomplete}
            value={navigationSuggestionValue || filterValue}
            onChange={onChange}
            onFocus={onFocus}
            values={selectedValues}
            inputRef={inputRef}
            shouldFocusOnClose
            fitToAnchorWidth={false}
            onBlur={onBlur}
            selectedChipRender={renderChip}
        >
            <List theme={theme}>
                {filteredCities.map((city, index) => (
                    <ListItem
                        size={Size.tiny}
                        isClickable
                        theme={theme}
                        key={city.id}
                        isHighlighted={index === activeItemIndex}
                        onItemSelected={() => setSelectedCity(city)}
                    >
                        <div>{city.text}</div>
                    </ListItem>
                ))}
            </List>
        </AutocompleteMultiple>
    );
};
