import { List, ListItem, Select, type Theme } from '@lumx/react';
import React, { useState } from 'react';

export default ({ theme }: { theme?: Theme }) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = React.useState('');
    const clearSelected = (event: React.SyntheticEvent) => {
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
                              size="tiny"
                          >
                              {choice}
                          </ListItem>
                      ))
                    : [
                          <ListItem key={0} size="tiny">
                              No data
                          </ListItem>,
                      ]}
            </List>
        </Select>
    );
};
