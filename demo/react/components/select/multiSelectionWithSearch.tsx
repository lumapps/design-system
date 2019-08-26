import React, { useState } from 'react';

import { List, ListDivider, ListItem, Select, TextField, Theme } from 'LumX';

import { mdiMagnify } from '@mdi/js';
import { useBooleanState } from 'LumX/core/react/hooks';
import { CHOICES, LABEL, PLACEHOLDER } from './constants';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

// const filter = (): void => {
//     // Empty.
// };

/**
 * The demo for the default <Select>s.
 *
 * @param theme The theme to use to display this demo.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const onInfiniteScroll = (): void => {
        console.log('You have reached the bottom of the select dropdown.');
    };

    const clearSelectedvalues = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | null, value?: string): void => {
        // tslint:disable-next-line: no-unused-expression
        event && event.stopPropagation();
        setSelectedValues(value ? selectedValues.filter((val: string) => val !== value) : []);
    };

    const onItemSelectedHandler: (item: string) => void = (item: string): void => {
        if (selectedValues.includes(item)) {
            setSelectedValues(selectedValues.filter((val: string) => item !== val));
            return;
        }
        setSelectedValues([...selectedValues, item]);
    };

    const [filterValue, setFilterValue] = useState('');
    const filteredChoices = CHOICES.filter((choice: string) =>
        choice
            .replace(' ', '')
            .toLowerCase()
            .includes(filterValue.replace(' ', '').toLowerCase()),
    );

    return (
        <Select
            multiple
            isOpen={isOpen}
            selectedValues={selectedValues}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onClear={clearSelectedvalues}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
            onInfinite={onInfiniteScroll}
        >
            <List>
                <TextField initialValue={filterValue} onChange={setFilterValue} icon={mdiMagnify} />
                <ListDivider />
                {filteredChoices.length > 0
                    ? filteredChoices.map((choice: string, index: number) => (
                          // tslint:disable-next-line: jsx-no-lambda
                          <ListItem
                              isClickable
                              isSelected={selectedValues.includes(choice)}
                              key={index}
                              onItemSelected={(): void => onItemSelectedHandler(choice)}
                          >
                              {choice}
                          </ListItem>
                      ))
                    : [<ListItem key={0}>No data</ListItem>]}
            </List>
        </Select>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
