/* istanbul ignore file */
import { Chip, List, ListItem, SelectMultiple, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import noop from 'lodash/noop';
import React, { MouseEventHandler, SyntheticEvent, useState } from 'react';
import { SelectVariant } from './constants';

export default { title: 'LumX components/select/Select Multiple' };

const PLACEHOLDER = 'Select values';
const LABEL = 'Select label';
const CHOICES = ['First item', 'Second item', 'Third item'];

export const DefaultSelectMultiple = ({ theme }: any) => {
    const [values, setValues] = useState<string[]>([]);
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }

        closeSelect();
        setValues([...values, item]);
    };

    return (
        <SelectMultiple
            isOpen={isOpen}
            value={values}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice) => (
                          <ListItem
                              isSelected={values.includes(choice)}
                              key={choice}
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
        </SelectMultiple>
    );
};

export const SelectMultipleWithNoData = ({ theme }: any) => {
    return (
        <SelectMultiple
            isOpen
            value={[]}
            onClear={noop}
            clearButtonProps={{ label: 'Clear' }}
            label="Select label"
            placeholder="Select values"
            theme={theme}
            onInputClick={noop}
            onDropdownClose={noop}
        >
            <List isClickable>
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </SelectMultiple>
    );
};

export const DisabledSelectMultiple = ({ theme }: any) => {
    return (
        <SelectMultiple
            isOpen
            value={[]}
            onClear={noop}
            clearButtonProps={{ label: 'Clear' }}
            label="Select label"
            placeholder="Select values"
            theme={theme}
            onInputClick={noop}
            onDropdownClose={noop}
            isDisabled
        />
    );
};

export const ChipsSelectMultiple = ({ theme }: any) => {
    const [values, setValues] = useState<string[]>([]);
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }

        closeSelect();
        setValues([...values, item]);
    };

    return (
        <SelectMultiple
            variant={SelectVariant.chip}
            isOpen={isOpen}
            value={values}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice) => (
                          <ListItem
                              isSelected={values.includes(choice)}
                              key={choice}
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
        </SelectMultiple>
    );
};

export const ChipsCustomSelectMultiple = ({ theme }: any) => {
    const [values, setValues] = useState<string[]>([]);
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }

        closeSelect();
        setValues([...values, item]);
    };

    const customSelectChipRenderer = (choice: string, index: number, onClear: any, isDisabled: any) => {
        const onClick: MouseEventHandler = (event) => onClear && onClear(event, choice);
        return (
            <Chip
                key={choice}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
                theme={theme}
            >
                {choice}
            </Chip>
        );
    };

    return (
        <SelectMultiple
            isOpen={isOpen}
            value={values}
            onClear={clearSelected}
            clearButtonProps={{ label: 'Clear' }}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            selectedChipRender={customSelectChipRenderer}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice) => (
                          <ListItem
                              isSelected={values.includes(choice)}
                              key={choice}
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
        </SelectMultiple>
    );
};
