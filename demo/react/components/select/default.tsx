import React, { useState } from 'react';

import { List, ListItem, Select, Theme } from 'LumX';

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

/**
 * The demo for the default <Select>s.
 *
 * @param theme The theme to use to display this demo.
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    const clearSelectedvalues = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value?: string): void => {
        event.stopPropagation();
        setSelectedValues(value ? selectedValues.filter((val: string) => val !== value) : []);
    };

    const onItemSelectedHandler: (item: string) => void = (item: string): void => {
        if (selectedValues.includes(item)) {
            return;
        }
        closeSelect();
        setSelectedValues([item]);
    };

    return (
        <Select
            isOpen={isOpen}
            selectedValues={selectedValues}
            onClear={clearSelectedvalues}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List>
                {CHOICES.length > 0
                    ? CHOICES.map((choice: string, index: number) => (
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
