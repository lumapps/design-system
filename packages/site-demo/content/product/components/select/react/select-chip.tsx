import React from 'react';

import { List, ListItem, Select, SelectVariant, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';

const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
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
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
        >
            <List isClickable={isOpen}>
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

export default App;
