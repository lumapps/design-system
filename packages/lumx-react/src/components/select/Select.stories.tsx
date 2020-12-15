import { List, ListItem, Select, Size, TextField } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import range from 'lodash/range';
import React, { SyntheticEvent, useState } from 'react';
import { SelectVariant } from './constants';

export default { title: 'LumX components/select/Select' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const SimpleSelect = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = useState<string>('');
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const selectItem = (item: string) => () => {
        closeSelect();
        setValue(item);
    };

    return (
        <Select
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={value}
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
                              isSelected={value === choice}
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
        </Select>
    );
};

export const SimpleSelectWithInfiniteScroll = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const [items, setItems] = useState(CHOICES);
    const [value, setValue] = useState<string>('');
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const selectItem = (item: string) => () => {
        closeSelect();
        setValue(item);
    };

    const onInfinite = () => {
        setItems([...items, ...range(10).map((i) => `item ${items.length + i}`)]);
    };

    return (
        <Select
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={value}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            onInfiniteScroll={onInfinite}
        >
            <List isClickable>
                {items.length > 0
                    ? items.map((choice) => (
                          <ListItem
                              isSelected={value === choice}
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
        </Select>
    );
};

export const DisabledSelect = ({ theme }: any) => {
    return (
        <Select
            isOpen={false}
            value=""
            label={text('label', 'My select')}
            placeholder={text('placeholder', 'Placeholder')}
            theme={theme}
            onInputClick={noop}
            onDropdownClose={noop}
            isDisabled
        >
            <List theme={theme} isClickable>
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </Select>
    );
};

export const SelectWithClearButton = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = useState<string>('');
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const clearSelected = (event: SyntheticEvent, newValue: string) => {
        event.stopPropagation();
        setValue(newValue);
    };

    const selectItem = (item: string) => () => {
        closeSelect();
        setValue(item);
    };

    return (
        <Select
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={value}
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
                              isSelected={value === choice}
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
        </Select>
    );
};

export const SelectWithAnotherField = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = useState<string>('');
    const [blurred, setWasBlurred] = useState('');
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const clearSelected = (event: SyntheticEvent, newValue: string) => {
        event.stopPropagation();
        setValue(newValue);
    };

    const selectItem = (item: string) => () => {
        closeSelect();
        setValue(item);
    };

    const onBlur = () => {
        setWasBlurred('was blurred');
    };

    return (
        <>
            <TextField
                value={text('Value', 'myvalue')}
                label={text('Label', 'I am the label')}
                placeholder={text('Placeholder', 'ex: A value')}
                theme={theme}
                onChange={noop}
            />
            <Select
                style={{ width: '100%' }}
                isOpen={isOpen}
                value={value}
                onClear={clearSelected}
                clearButtonProps={{ label: 'Clear' }}
                label={LABEL}
                placeholder={PLACEHOLDER}
                theme={theme}
                onInputClick={toggleSelect}
                onDropdownClose={closeSelect}
                onBlur={onBlur}
            >
                <List isClickable>
                    {CHOICES.length > 0
                        ? CHOICES.map((choice) => (
                              <ListItem
                                  isSelected={value === choice}
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
            </Select>
            {blurred}
        </>
    );
};

export const SelectWithNoData = ({ theme }: any) => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(true);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label={text('label', 'My select')}
            placeholder={text('placeholder', 'Placeholder')}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List theme={theme} isClickable>
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </Select>
    );
};

export const SelectWithHelper = ({ theme }: any) => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label={text('label', 'Country')}
            placeholder={text('placeholder', 'Your country')}
            theme={theme}
            helper={text('helper', 'This is used in analytics')}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List theme={theme} isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectWithError = ({ theme }: any) => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label={text('label', 'Country')}
            placeholder={text('placeholder', 'Your country')}
            theme={theme}
            helper={text('helper', 'This is used in analytics')}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            hasError
            error={text('Error', 'Please select something :)')}
        >
            <List theme={theme} isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectSuccess = ({ theme }: any) => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label={text('label', 'Country')}
            placeholder={text('placeholder', 'Your country')}
            theme={theme}
            helper={text('helper', 'This is used in analytics')}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            isValid
        >
            <List theme={theme} isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectWithChipVariant = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = useState<string>('');
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    const selectItem = (item: string) => () => {
        closeSelect();
        setValue(item);
    };

    const onClear = () => setValue('');

    return (
        <Select
            style={{ width: '100%' }}
            isOpen={isOpen}
            value={value}
            label={LABEL}
            placeholder={PLACEHOLDER}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            variant={SelectVariant.chip}
            onClear={onClear}
            clearButtonProps={{ label: 'Clear' }}
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice) => (
                          <ListItem
                              isSelected={value === choice}
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
        </Select>
    );
};
