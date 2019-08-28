import React, { ReactNode, useState } from 'react';

import { Chip, Icon, List, ListDivider, ListItem, ListItemSize, Select, Size, TextField, Theme } from 'LumX';

import { mdiClose, mdiMagnify } from '@mdi/js';
import { useBooleanState } from 'LumX/core/react/hooks';
import { CHOICES_WITH_ICONS, LABEL, PLACEHOLDER } from './constants';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

interface IChoice {
    label: string;
    icon: string;
}

/////////////////////////////

const getChoiceByValue = (value: string): IChoice | undefined =>
    CHOICES_WITH_ICONS.find((ch: IChoice) => ch.label === value);

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
    const filteredChoices = CHOICES_WITH_ICONS.filter((choice: IChoice) =>
        choice.label
            .replace(' ', '')
            .toLowerCase()
            .includes(filterValue.replace(' ', '').toLowerCase()),
    );

    return (
        <Select
            isMultiple
            isOpen={isOpen}
            selectedValues={selectedValues}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onClear={clearSelectedvalues}
            onDropdownClose={closeSelect}
            onInputClick={toggleSelect}
            onInfiniteScroll={onInfiniteScroll}
            selectedChipRender={(
                choice: string,
                index: number,
                onClear: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, choice: string) => void,
                isDisabled: boolean,
            ): ReactNode | string => {
                const matchedChoice = getChoiceByValue(choice);

                return (
                    <Chip
                        key={index}
                        after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                        before={<Icon size={Size.xs} icon={(matchedChoice && matchedChoice.icon) || ''} />}
                        isDisabled={isDisabled}
                        size={Size.s}
                        // tslint:disable-next-line: jsx-no-lambda
                        onAfterClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>
                            onClear && onClear(event, choice)
                        }
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>
                            onClear && onClear(event, choice)
                        }
                    >
                        {choice}
                    </Chip>
                );
            }}
            selectedValueRender={(choice: string): React.ReactNode => {
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
            <List>
                <div>
                    <TextField
                        value={filterValue}
                        initialValue={filterValue}
                        onChange={setFilterValue}
                        icon={mdiMagnify}
                    />
                    <ListDivider />
                </div>
                <div>
                    {filteredChoices.length > 0
                        ? filteredChoices.map((choice: IChoice, index: number) => (
                              // tslint:disable-next-line: jsx-no-lambda
                              <ListItem
                                  size={ListItemSize.tiny}
                                  isClickable
                                  isSelected={selectedValues.includes(choice.label)}
                                  key={index}
                                  onItemSelected={(): void => onItemSelectedHandler(choice.label)}
                                  before={<Icon size={Size.xs} icon={choice.icon} />}
                              >
                                  <div>{choice.label}</div>
                              </ListItem>
                          ))
                        : [<ListItem key={0}>No data</ListItem>]}
                </div>
            </List>
        </Select>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
