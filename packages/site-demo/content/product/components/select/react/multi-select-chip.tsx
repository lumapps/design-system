import React, { SyntheticEvent, useState } from 'react';

import { List, ListItem, Select, SelectVariant, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);
    const [values, setValues] = useState<string[]>([]);

    const clearSelected = (event?: SyntheticEvent, value?: string) => {
        event?.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            clearSelected(undefined, item);
            return;
        }
        setValues([...values, item]);
    };

    return (
        <Select
            isMultiple
            isOpen={isOpen}
            value={values}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            variant={SelectVariant.chip}
            onClear={clearSelected}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
        >
            <List isClickable={isOpen}>
                {CHOICES.length > 0
                    ? CHOICES.map((choice) => (
                          <ListItem
                              isSelected={values.includes(choice)}
                              key={choice}
                              onItemSelected={selectItem(choice)}
                              size={Size.tiny}
                          >
                              {choice}
                          </ListItem>
                      ))
                    : [
                          <ListItem key={0} size={Size.tiny}>
                              No data
                          </ListItem>,
                      ]}
            </List>
        </Select>
    );
};

export default App;
