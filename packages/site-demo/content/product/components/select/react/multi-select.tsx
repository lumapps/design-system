import React from 'react';

import { Select, List, ListItem, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';

const App = ({ theme }) => {
    const CHOICES = ['First item', 'Second item', 'Third item'];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
    const [values, setValues] = React.useState([]);

    const clearSelectedvalues = (event, value) => {
        event && event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const onItemSelectedHandler = (item) => {
        if (values.includes(item)) {
            clearSelectedvalues(null, item);
            return;
        }
        setValues([...values, item]);
    };

    return (
        <Select
            style={{ width: '100%' }}
            value={values}
            isOpen={isOpen}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
            label={LABEL}
            isMultiple={true}
            placeholder={PLACEHOLDER}
            theme={theme}
            onClear={clearSelectedvalues}
        >
            <List isClickable={isOpen}>
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
            </List>
        </Select>
    );
};

export default App;
