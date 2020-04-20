import React, { SyntheticEvent } from 'react';

import { List, ListItem, Select, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';

const App = ({ theme }: any) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = React.useState<string>('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
            hasError={true}
            value={value}
            onClear={clearSelected}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable={isOpen}>
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

export default App;
