import React, { useState } from 'react';

import { List, ListItem, Select, SelectVariant, Theme } from 'LumX';

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
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const clearSelectedvalues = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | null, value?: string): void => {
        // tslint:disable-next-line: no-unused-expression
        event && event.stopPropagation();
        setSelectedValues(value ? selectedValues.filter((val: string) => val !== value) : []);
    };

    const onItemSelectedHandler: (item: string) => void = (item: string): void => {
        if (selectedValues.includes(item)) {
            clearSelectedvalues(null, item);
            return;
        }
        setSelectedValues([...selectedValues, item]);
    };

    return (
        <Select
            multiple
            isOpen={isOpen}
            selectedValues={selectedValues}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            variant={SelectVariant.chip}
            onClear={clearSelectedvalues}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
        >
            <List>
                {CHOICES.length > 0
                    ? CHOICES.map((choice: string, index: number) => (
                          // tslint:disable-next-line: jsx-no-lambda
                          <ListItem
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
