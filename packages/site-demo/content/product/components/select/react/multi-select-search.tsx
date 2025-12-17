import React, { SyntheticEvent, useState } from 'react';

import { mdiAccessPoint, mdiAccountBox, mdiAlphaF, mdiClose, mdiMagnify } from '@lumx/icons';
import { Chip, Icon, List, ListDivider, ListItem, ListSubheader, SelectMultiple, Size, TextField } from '@lumx/react';

export const App = ({ theme }: any) => {
    const CHOICES_WITH_ICONS = [
        {
            icon: mdiAccessPoint,
            label: 'First item',
        },
        {
            icon: mdiAccountBox,
            label: 'Second item',
        },
        {
            icon: mdiAlphaF,
            label: 'Third item',
        },
    ];
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const getChoiceByValue = (value: string) => CHOICES_WITH_ICONS.find((ch) => ch.label === value);

    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [values, setValues] = React.useState<string[]>([]);

    const onInfiniteScroll = () => {
        console.log('You have reached the bottom of the select dropdown.');
    };

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event?.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            setValues(values.filter((val) => item !== val));
            return;
        }
        setValues([...values, item]);
    };

    const [filterValue, setFilterValue] = React.useState('');
    const filteredChoices = CHOICES_WITH_ICONS.filter((choice) =>
        choice.label.replace(' ', '').toLowerCase().includes(filterValue.replace(' ', '').toLowerCase()),
    );

    const selectedChipRender = (choice: string, index: number, onClear: any, isDisabled: boolean) => {
        const matchedChoice = getChoiceByValue(choice);
        const onClick = (event: SyntheticEvent) => onClear && onClear(event, choice);
        return (
            <Chip
                key={index}
                after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                before={<Icon size={Size.xs} icon={(matchedChoice && matchedChoice.icon) || ''} />}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
            >
                {choice}
            </Chip>
        );
    };
    const selectedValueRender = (choice: string) => {
        const matchedChoice = getChoiceByValue(choice);
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon size={Size.xs} icon={(matchedChoice && matchedChoice.icon) || ''} style={{ marginRight: 5 }} />
                {matchedChoice && matchedChoice.label}
            </div>
        );
    };
    return (
        <SelectMultiple
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={values}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
            onInfiniteScroll={onInfiniteScroll}
            selectedChipRender={selectedChipRender}
            selectedValueRender={selectedValueRender}
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
                              isSelected={values.includes(choice.label)}
                              key={index}
                              onItemSelected={selectItem(choice.label)}
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
        </SelectMultiple>
    );
};
