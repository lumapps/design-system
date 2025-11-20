import React, { useState } from 'react';

import { List, ListItem, Select, SelectVariant, Size } from '@lumx/react';

export const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = React.useState<string>('');

    const clearSelected = (event: { stopPropagation(): void }) => {
        event?.stopPropagation();
        setValue('');
    };

    const selectItem = (item: any) => {
        if (value === item) {
            setValue('');
        } else {
            setValue(item);
        }
        closeSelect();
    };
    const onItemSelected = (choice: any) => () => selectItem(choice);
    return (
        <Select
            isOpen={isOpen}
            value={value}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            variant={SelectVariant.chip}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
        >
            <List>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={value === choice}
                              key={index}
                              onItemSelected={onItemSelected(choice)}
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
