import React, { SyntheticEvent, useState } from 'react';

import { List, ListItem, Select, Size } from '@lumx/react';

export const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = React.useState<string>('');

    const clearSelected = (event: SyntheticEvent) => {
        event.stopPropagation();
        setValue('');
    };

    const selectItem = (item: string) => () => {
        if (value === item) {
            setValue('');
        } else {
            setValue(item);
        }
        closeSelect();
    };

    return (
        <Select
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={value}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={value === choice}
                              key={index}
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
