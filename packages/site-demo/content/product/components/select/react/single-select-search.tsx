import React, { SyntheticEvent, useState } from 'react';

import { mdiMagnify } from '@lumx/icons';
import { List, ListDivider, ListItem, ListSubheader, Select, Size, TextField } from '@lumx/react';

export const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = React.useState<string>('');
    const [filterValue, setFilterValue] = React.useState('');
    const filteredChoices = CHOICES.filter((choice) =>
        choice.replace(' ', '').toLowerCase().includes(filterValue.replace(' ', '').toLowerCase()),
    );

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
            closeOnClick={false}
            isOpen={isOpen}
            label={LABEL}
            placeholder={PLACEHOLDER}
            style={{ width: '100%' }}
            theme={theme}
            value={value}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List>
                <ListSubheader>
                    <TextField
                        style={{ width: '100%', padding: 0 }}
                        value={filterValue}
                        onChange={setFilterValue}
                        icon={mdiMagnify}
                        size={Size.tiny}
                    />
                </ListSubheader>

                <ListDivider />

                {filteredChoices.length > 0
                    ? filteredChoices.map((choice, index) => (
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
