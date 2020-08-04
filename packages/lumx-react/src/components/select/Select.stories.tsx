import { List, ListItem, Select, Size, TextField } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import range from 'lodash/range';
import React, { SyntheticEvent, useState } from 'react';
import { SelectVariant } from './constants';

export default { title: 'LumX components/select/Select' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const simpleSelect = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = React.useState<string>('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={value === choice}
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

export const simpleSelectWithInfiniteScroll = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';
    const [items, setItems] = useState(CHOICES);
    const [value, setValue] = React.useState<string>('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
                    ? items.map((choice, index) => (
                          <ListItem
                              isSelected={value === choice}
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

export const disabledSelect = ({ theme }: any) => {
    return (
        <Select
            isOpen={false}
            value={''}
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

export const selectWithClearButton = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = React.useState<string>('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    // tslint:disable-next-line: no-shadowed-variable
    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValue(value);
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
                              isSelected={value === choice}
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

    const [value, setValue] = React.useState<string>('');
    const [blurred, setWasBlurred] = React.useState('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    // tslint:disable-next-line: no-shadowed-variable
    const clearSelected = (event: SyntheticEvent, value: string) => {
        event.stopPropagation();
        setValue(value);
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
                                  isSelected={value === choice}
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
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(true);

    return (
        <Select
            isOpen={isOpen}
            value={''}
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
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value={''}
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
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value={''}
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
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value={''}
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

export const selectWithChipVariant = ({ theme }: any) => {
    const PLACEHOLDER = 'Select a value';
    const LABEL = 'Select label';

    const [value, setValue] = React.useState<string>('');
    // tslint:disable-next-line:no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(false);

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
        >
            <List isClickable>
                {CHOICES.length > 0
                    ? CHOICES.map((choice, index) => (
                          <ListItem
                              isSelected={value === choice}
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
