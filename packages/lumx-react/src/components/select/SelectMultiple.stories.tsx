/* istanbul ignore file */
import { Chip, List, ListItem, SelectMultiple, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';
import noop from 'lodash/noop';
import React, { SyntheticEvent } from 'react';
import { SelectVariant } from './constants';

export default { title: 'LumX components/Select Multiple' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const defaultSelectMultiple = ({ theme }: any) => {
    const PLACEHOLDER = 'Select values';
    const LABEL = 'Select label';

    const [values, setValues] = React.useState<string[]>([]);
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={values.includes(choice)}
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
        </SelectMultiple>
    );
};

export const selectMultipleWithNoData = ({ theme }: any) => {
    return (
        <SelectMultiple
            isOpen={true}
            value={[]}
            onClear={noop}
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

export const disabledSelectMultiple = ({ theme }: any) => {
    return (
        <SelectMultiple
            isOpen={true}
            value={[]}
            onClear={noop}
            label="Select label"
            placeholder="Select values"
            theme={theme}
            onInputClick={noop}
            onDropdownClose={noop}
            isDisabled
        />
    );
};

export const chipsSelectMultiple = ({ theme }: any) => {
    const PLACEHOLDER = 'Select values';
    const LABEL = 'Select label';

    const [values, setValues] = React.useState<string[]>([]);
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={values.includes(choice)}
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
        </SelectMultiple>
    );
};

export const chipsCustomSelectMultiple = ({ theme }: any) => {
    const PLACEHOLDER = 'Select values';
    const LABEL = 'Select label';

    const [values, setValues] = React.useState<string[]>([]);
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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

    const customSelectChipRenderer = (
        choice: string,
        index: number,
        onClear?: (event: SyntheticEvent, choice: string) => void,
        isDisabled?: boolean,
        // tslint:disable-next-line: no-shadowed-variable
        theme?: any,
    ) => {
        const onClick = (event: React.MouseEvent) => onClear && onClear(event, choice);
        return (
            <Chip
                key={index}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
                theme={theme}
            >
                -> {choice}
            </Chip>
        );
    };

    return (
        <SelectMultiple
            isOpen={isOpen}
            value={values}
            onClear={clearSelected}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            selectedChipRender={customSelectChipRenderer}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={values.includes(choice)}
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
        </SelectMultiple>
    );
};
