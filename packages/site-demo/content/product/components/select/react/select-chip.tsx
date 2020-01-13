import React from 'react';

import { ListItem, Select, SelectVariant, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';

const App = ({ theme }) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
    const [values, setValues] = React.useState([]);

    const clearSelectedvalues = (event: { stopPropagation(): void }, value: any) => {
        event?.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const onItemSelectedHandler = (item) => {
        if (values.includes(item)) {
            return;
        }
        closeSelect();
        setValues([item]);
    };

    return (
        <Select
            isOpen={isOpen}
            value={values}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            variant={SelectVariant.chip}
            onClear={clearSelectedvalues}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
        >
            {CHOICES.length > 0
                ? CHOICES.map((choice, index) => (
                      <ListItem
                          isClickable
                          isSelected={values.includes(choice)}
                          key={index}
                          onItemSelected={() => onItemSelectedHandler(choice)}
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
        </Select>
    );
};

export default App;
