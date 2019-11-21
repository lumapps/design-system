import React from 'react';

import { Select, List, ListItem, Size, TextField, Chip, ListDivider, Icon, ListSubheader } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';
import { mdiAccessPoint, mdiAccountBadge, mdiAlphaF, mdiMagnify, mdiClose } from '@lumx/icons';

const App = ({ theme }) => {
    const CHOICES_WITH_ICONS = [
        {
            label: 'First item',
            icon: mdiAccessPoint,
        },
        {
            label: 'Second item',
            icon: mdiAccountBadge,
        },
        {
            label: 'Third item',
            icon: mdiAlphaF,
        },
    ];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const getChoiceByValue = (value) => CHOICES_WITH_ICONS.find((ch) => ch.label === value);

    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
    const [values, setValues] = React.useState([]);

    const onInfiniteScroll = () => {
        console.log('You have reached the bottom of the select dropdown.');
    };

    const clearSelectedvalues = (event, value) => {
        event && event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const onItemSelectedHandler = (item) => {
        if (values.includes(item)) {
            setValues(values.filter((val) => item !== val));
            return;
        }
        setValues([...values, item]);
    };

    const [filterValue, setFilterValue] = React.useState('');
    const filteredChoices = CHOICES_WITH_ICONS.filter((choice) =>
        choice.label
            .replace(' ', '')
            .toLowerCase()
            .includes(filterValue.replace(' ', '').toLowerCase()),
    );

    return (
        <Select
            style={{ width: '100%' }}
            isMultiple
            isOpen={isOpen}
            value={values}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onClear={clearSelectedvalues}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
            onInfiniteScroll={onInfiniteScroll}
            selectedChipRender={(choice, index, onClear, isDisabled) => {
                const matchedChoice = getChoiceByValue(choice);

                return (
                    <Chip
                        key={index}
                        after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                        before={<Icon size={Size.xs} icon={(matchedChoice && matchedChoice.icon) || ''} />}
                        isDisabled={isDisabled}
                        size={Size.s}
                        onAfterClick={(event) => onClear && onClear(event, choice)}
                        onClick={(event) => onClear && onClear(event, choice)}
                    >
                        {choice}
                    </Chip>
                );
            }}
            selectedValueRender={(choice) => {
                const matchedChoice = getChoiceByValue(choice);
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon
                            size={Size.xs}
                            icon={(matchedChoice && matchedChoice.icon) || ''}
                            style={{ marginRight: 5 }}
                        />
                        {matchedChoice && matchedChoice.label}
                    </div>
                );
            }}
        >
            <List isClickable={isOpen}>
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
                              size={Size.tiny}
                              isClickable
                              isSelected={values.includes(choice.label)}
                              key={index}
                              onItemSelected={() => onItemSelectedHandler(choice.label)}
                              before={<Icon size={Size.xs} icon={choice.icon} />}
                              size={Size.tiny}
                          >
                              <div>{choice.label}</div>
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
