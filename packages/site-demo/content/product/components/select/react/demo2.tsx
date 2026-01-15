import { mdiMagnify } from '@lumx/icons';
import { List, ListDivider, ListItem, ListSubheader, Select, TextField, Theme } from '@lumx/react';
import React, { useState } from 'react';

export default ({ theme }: { theme?: Theme }) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = React.useState('');
    const [filterValue, setFilterValue] = React.useState('');
    const filteredChoices = CHOICES.filter((choice) =>
        choice.replace(' ', '').toLowerCase().includes(filterValue.replace(' ', '').toLowerCase()),
    );
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
                        size="tiny"
                    />
                </ListSubheader>

                <ListDivider />

                {filteredChoices.length > 0
                    ? filteredChoices.map((choice, index) => (
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
