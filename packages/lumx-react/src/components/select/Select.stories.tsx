import { List, ListItem, Select, Size, TextField } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React, { SyntheticEvent } from 'react';

export default { title: 'Select' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const simpleSelect = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [values, setValues] = React.useState<string[]>([]);
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
        </Select>
    );
};

export const selectWithAnotherField = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [values, setValues] = React.useState<string[]>([]);
    const [blurred, setWasBlurred] = React.useState('');
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
            </Select>
            {blurred}
        </>
    );
};

export const selectWithNoData = ({ theme }: any) => {
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(true);

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
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </Select>
    );
};

export const selectWithHelper = ({ theme }: any) => {
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
                {CHOICES.map((choice, index) => (
                    <ListItem key={index} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const selectWithError = ({ theme }: any) => {
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
            hasError={true}
            error={text('Error', 'Please select something :)')}
        >
            <List theme={theme} isClickable>
                {CHOICES.map((choice, index) => (
                    <ListItem key={index} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const selectSuccess = ({ theme }: any) => {
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
                {CHOICES.map((choice, index) => (
                    <ListItem key={index} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};
