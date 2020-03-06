import { List, ListItem, Select, Size, TextField } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React, { SyntheticEvent, useState } from 'react';

export default { title: 'Select' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const SimpleSelect = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [values, setValues] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }

        closeSelect();
        setValues([item]);
    };

    return (
        <Select
            style={{ width: '100%' }}
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
        </Select>
    );
};

export const SelectWithAnotherField = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [values, setValues] = useState<string[]>([]);
    const [blurred, setWasBlurred] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValues(value ? values.filter((val) => val !== value) : []);
    };

    const selectItem = (item: string) => () => {
        if (values.includes(item)) {
            return;
        }

        closeSelect();
        setValues([item]);
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
                value={values}
                onClear={clearSelected}
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
            </Select>
            {blurred}
        </>
    );
};

export const SelectWithNoData = ({ theme }: any) => {
    const [isOpen, setIsOpen] = useState(true);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    return (
        <Select
            isOpen={isOpen}
            value={[]}
            label={text('label', 'My select')}
            placeholder={text('placeholder', 'Placeholder')}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List theme={theme} isClickable>
                <ListItem size={Size.tiny}>No data</ListItem>
            </List>
        </Select>
    );
};

export const SelectWithHelper = ({ theme }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    return (
        <Select
            isOpen={isOpen}
            value={[]}
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
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    return (
        <Select
            isOpen={isOpen}
            value={[]}
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
    const [isOpen, setIsOpen] = useState(false);
    const closeSelect = () => setIsOpen(false);
    const toggleSelect = () => setIsOpen(!isOpen);

    return (
        <Select
            isOpen={isOpen}
            value={[]}
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
