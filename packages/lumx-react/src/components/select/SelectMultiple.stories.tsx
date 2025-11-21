/* istanbul ignore file */
import { mdiTram } from '@lumx/icons';
import {
    Chip,
    Dialog,
    List,
    ListDivider,
    ListItem,
    ListSubheader,
    SelectMultiple,
    Size,
    TextField,
    Toolbar,
} from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import noop from 'lodash/noop';
import { MouseEventHandler, SyntheticEvent, useRef, useState } from 'react';
import { SelectVariant } from './constants';

export default { title: 'LumX components/select/Select Multiple' };

const PLACEHOLDER = 'Select values';
const LABEL = 'Select label';
const CHOICES = ['First item', 'Second item', 'Third item'];

export const DefaultSelectMultiple = () => {
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
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
            icon={mdiTram}
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

export const SelectMultipleWithNoData = () => {
    return (
        <SelectMultiple
            isOpen
            value={[]}
            onClear={noop}
            clearButtonProps={{ label: 'Clear' }}
            label="Select label"
            placeholder="Select values"
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

export const DisabledSelectMultiple = () => {
    return (
        <SelectMultiple
            isOpen
            value={[]}
            onClear={noop}
            clearButtonProps={{ label: 'Clear' }}
            label="Select label"
            placeholder="Select values"
            onInputClick={noop}
            onDropdownClose={noop}
            isDisabled
        />
    );
};

export const ChipsSelectMultiple = () => {
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

export const ChipsCustomSelectMultiple = () => {
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
            <Chip key={choice} isDisabled={isDisabled} size={Size.s} onAfterClick={onClick} onClick={onClick}>
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

/**
 * Test select focus trap (focus is contained inside the dialog then inside the select dropdown)
 */
export const SelectWithinADialog = () => {
    const searchFieldRef = useRef(null);

    const [searchText, setSearchText] = useState<string>();
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

    const filteredChoices =
        searchText && searchText.length > 0 ? CHOICES.filter((choice) => choice.includes(searchText)) : CHOICES;

    return (
        <Dialog isOpen>
            <header>
                <Toolbar label={<span className="lumx-typography-title">Dialog header</span>} />
            </header>
            <div className="lumx-spacing-padding-horizontal-huge lumx-spacing-padding-bottom-huge">
                {/* Testing hidden input do not count in th focus trap*/}
                <input hidden type="file" />
                <input type="hidden" />

                <div className="lumx-spacing-margin-bottom-huge">The select should capture the focus on open.</div>

                <SelectMultiple
                    isOpen={isOpen}
                    value={values}
                    onClear={clearSelected}
                    clearButtonProps={{ label: 'Clear' }}
                    label={LABEL}
                    placeholder={PLACEHOLDER}
                    onInputClick={toggleSelect}
                    onDropdownClose={closeSelect}
                    icon={mdiTram}
                    focusElement={searchFieldRef}
                >
                    <List isClickable>
                        <>
                            <ListSubheader>
                                <TextField
                                    clearButtonProps={{ label: 'Clear' }}
                                    placeholder="Search"
                                    role="searchbox"
                                    inputRef={searchFieldRef}
                                    onChange={setSearchText}
                                    value={searchText}
                                />
                            </ListSubheader>
                            <ListDivider role="presentation" />
                        </>

                        {filteredChoices.length > 0
                            ? filteredChoices.map((choice) => (
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
            </div>
        </Dialog>
    );
};
