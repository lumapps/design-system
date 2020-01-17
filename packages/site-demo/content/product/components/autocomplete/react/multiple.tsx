import React from 'react';

import { mdiClose } from '@lumx/icons';
import { AutocompleteMultiple, Chip, ChipGroup, Icon, List, ListItem, Size } from '@lumx/react';

interface ICity {
    id: string;
    text: string;
}

const App = ({ theme }) => {
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

    const INITIAL_STATE_SHOW_SUGGESTIONS = false;
    const INITIAL_STATE_NAVIGATION_SUGGESTION = undefined;

    /**
     * Internal state and ref setup.
     * - `showSuggestions`: allows to control when the suggestions are displayed or not.
     * - `wasBackspacePressed`: boolean to be used in order to determine whether the user wants to delete a selected value.
     * - `activeChip`: tag index that will be displayed as `highlighted` on the suggestion lists.
     * - `filterValue`: value currently displayed on the text field.
     * - `navigationSuggestion`: text displayed on the text field while the user is navigating through suggestions.
     * - `selectedValues`: list of currently selected values.
     * - `inputRef`: reference for the text field used to search suggestions
     */
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

    /**
     * Callback executed when the autocomplete closes.
     * In that scenario, we need to update the internal state to `false`.
     */
    const closeAutocomplete = () => {
        setShowSuggestions(false);
        resetChipNavigation();
    };

    /**
     * Callback triggered when a city is selected from the list. In this case, we want
     * to add the new city to the `selectedValues` list, and reset the `filterValue`,
     * `showSuggestions` and `navigationSuggestionValue` to their original state.
     */
    const setSelectedCity = (city) => {
        setSelectedValues([...selectedValues, city]);
        setFilterValue('');
        setShowSuggestions(INITIAL_STATE_SHOW_SUGGESTIONS);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
    };

    /**
     * Function that adds the new value to the list of values and resets the autocomplete.
     * In case the value is empty, we avoid adding it to the list. Else,
     * we reset the text field and change the navigation suggestions to its initial state
     */
    const onNewCityCreated = (newCity) => {
        if (newCity && newCity.length > 0) {
            setSelectedCity({
                id: newCity.replace(' ', '').toLowerCase(),
                text: newCity,
            });

            setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
        }
    };

    /**
     * Function triggered when one of the selected values wants to be removed. Upon removing the value
     * we want to keep focus on the Text Field so the user can continue their selection.
     * @param {Object} evt Event that triggered the function
     * @param {Object} city city to be erased.
     */
    const clearSelectedValue = (event, city) => {
        inputRef?.current?.focus();
        setSelectedValues(city ? selectedValues.filter((c) => c.id !== city.id) : []);
    };

    /**
     * Function triggered by the `onChange` event on the Text field. Here, we update the internal state
     * and set the suggestions as visible depending on whether the query is valid.
     * @param {string} value New value entered on the text field.
     */
    const onChange = (value) => {
        setFilterValue(value);
        setShowSuggestions(value.length > 0);
        setNavigationSuggestionValue(INITIAL_STATE_NAVIGATION_SUGGESTION);
        resetChipNavigation();
    };

    /**
     * Function triggered when the user is navigating through the suggestions list. Useful to show
     * the suggestion on the Text Field.
     * @param {Object} city      City navigated.
     * @param {string} city.name City name.
     */
    const onItemNavigated = (city) => {
        if (city && showSuggestions) {
            setNavigationSuggestionValue(city.text);
        }
    };

    const isTextFieldEmpty = () => filterValue.length === 0 && !navigationSuggestionValue;

    /**
     * Function triggered when the user hits BACKSPACE on their keyboards. The idea here is that, if the text
     * field is empty and there are values selected, we change
     * `wasBackspacePressed` to true and set the active chip to the last one. That will show the user that they are
     * about to delete the last value since it will be displayed as active. If they hit backspace once more, we
     * remove the last value, update the values list and change `wasBackspacePressed` back to false and start over.
     *
     * If there is a navigation suggestion, we need to remove it and let the user continue using the
     * text field. In that case, we trigger an `onChange` and reset the navigation suggestion.
     */
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

    /**
     * Callback triggered when the Text field is focused on. In this scenario,
     * we want to show the suggestion list if there is some text entered.
     */
    const onFocus = (evt) => {
        setShowSuggestions(filterValue.length > 0);
    };

    /**
     * Callback triggered when the Text field is blurred. In this scenario, we want
     * to hide the suggestions box and reset the chip navigation
     */
    const onBlur = (evt) => {
        resetChipNavigation();
    };

    return (
        <AutocompleteMultiple
            theme={theme}
            isOpen={showSuggestions && hasSuggestions}
            onClose={closeAutocomplete}
            value={navigationSuggestionValue || filterValue}
            onChange={onChange}
            onFocus={onFocus}
            shouldFocusOnClose
            values={selectedValues}
            inputRef={inputRef}
            fitToAnchorWidth
            onBlur={onBlur}
            selectedChipRender={(city: ICity, index) => (
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
            )}
        >
            <List theme={theme} isClickable>
                {filteredCities.map((city, index) => (
                    <ListItem
                        size={Size.tiny}
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

export default App;
