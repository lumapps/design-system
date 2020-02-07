import { List, ListItem, Select, Size } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Select' };

const CHOICES = ['First item', 'Second item', 'Third item'];

export const simpleSelect = ({ theme }: any) => {
    const selectedItem = select('Selected item', CHOICES, CHOICES[0]);
    // tslint:disable-next-line: no-unused
    const [isOpen, closeSelect, openSelect, toggleSelect] = useBooleanState(true);

    return (
        <Select
            isOpen={isOpen}
            value={[selectedItem]}
            label={text('label', 'My select')}
            placeholder={text('placeholder', 'Placeholder')}
            theme={theme}
            onInputClick={toggleSelect}
            onDropdownClose={closeSelect}
        >
            <List theme={theme} isClickable>
                {CHOICES.map((choice, index) => (
                    <ListItem isSelected={choice === selectedItem} key={index} size={Size.tiny}>
                        {choice}
                    </ListItem>
                ))}
            </List>
        </Select>
    );
};

export const selectWithNoData = ({ theme }: any) => {
    // tslint:disable-next-line: no-unused
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
    // tslint:disable-next-line: no-unused
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
    // tslint:disable-next-line: no-unused
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
    // tslint:disable-next-line: no-unused
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
