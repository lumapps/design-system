import { mdiBullhornOutline } from '@lumx/icons';
import { List, ListItem, Select, Size, TextField } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { SyntheticEvent, useState } from 'react';
import { range } from '@lumx/core/js/utils/collection/range';
import { SelectVariant } from './constants';

export default {
    title: 'LumX components/select/Select',
    component: Select,
    argTypes: {
        onInputClick: { action: true },
        onDropdownClose: { action: true },
    },
};

const CHOICES = ['First item', 'Second item', 'Third item'];

export const SimpleSelect = () => {
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
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            icon={mdiBullhornOutline}
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

export const SimpleSelectWithInfiniteScroll = () => {
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

export const DisabledSelect = () => {
    return (
        <Select
            isOpen={false}
            value=""
            label="My select"
            placeholder="Placeholder"
            onInputClick={onInputClick}
            onDropdownClose={onDropdownClose}
            isDisabled
        >
            <List isClickable>
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </Select>
    );
};

export const SelectWithClearButton = () => {
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

export const SelectWithAnotherField = () => {
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
            <TextField value="myvalue" label="I am the label" placeholder="ex: A value" onChange={() => {}} />
            <Select
                style={{ width: '100%' }}
                isOpen={isOpen}
                value={value}
                onClear={clearSelected}
                clearButtonProps={{ label: 'Clear' }}
                label={LABEL}
                placeholder={PLACEHOLDER}
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

export const SelectWithNoData = () => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(true);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label="My select"
            placeholder="Placeholder"
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                <ListItem key={0} size={Size.tiny}>
                    No data
                </ListItem>
            </List>
        </Select>
    );
};

export const SelectWithHelper = () => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label="Country"
            placeholder="Your country"
            helper="This is used in analytics"
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectWithError = () => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label="Country"
            placeholder="Your country"
            helper="This is used in analytics"
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            hasError
            error="Please select something :)"
        >
            <List isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectSuccess = () => {
    const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

    return (
        <Select
            isOpen={isOpen}
            value=""
            label="Country"
            placeholder="Your country"
            helper="This is used in analytics"
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            isValid
        >
            <List isClickable>
                {CHOICES.map((choice) => (
                    <ListItem key={choice} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const SelectWithChipVariant = () => {
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
