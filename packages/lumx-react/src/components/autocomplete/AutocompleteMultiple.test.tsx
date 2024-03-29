import React from 'react';

import { Dropdown, List, ListItem, Size, TextField } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { CITIES as suggestions } from './__mockData__';
import { AutocompleteMultiple, AutocompleteMultipleProps } from './AutocompleteMultiple';

const CLASSNAME = AutocompleteMultiple.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<AutocompleteMultipleProps> = {}) => {
    render(
        <AutocompleteMultiple {...(props as any)}>
            <List>
                {suggestions.map((suggestion) => (
                    <ListItem size={Size.tiny} key={suggestion.id}>
                        <div>{suggestion.text}</div>
                    </ListItem>
                ))}
            </List>
        </AutocompleteMultiple>,
    );
    const autocompleteMultiple = getByClassName(document.body, CLASSNAME);
    const textField = getByClassName(autocompleteMultiple, TextField.className as string);
    const getDropdown = () => queryByClassName(document.body, Dropdown.className as string);
    return { props, autocompleteMultiple, textField, getDropdown };
};

describe(`<${AutocompleteMultiple.displayName}>`, () => {
    it('should render default', () => {
        const { autocompleteMultiple, textField, getDropdown } = setup({});

        expect(autocompleteMultiple).toBeInTheDocument();
        expect(autocompleteMultiple.className).toMatchInlineSnapshot('"lumx-autocomplete-multiple lumx-autocomplete"');
        expect(textField).toBeInTheDocument();
        expect(getDropdown()).not.toBeInTheDocument();
    });

    it('should render open', () => {
        const { getDropdown } = setup({ isOpen: true });
        expect(getDropdown()).toBeInTheDocument();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'autocompleteMultiple',
        forwardRef: 'autocompleteMultiple',
        forwardAttributes: 'autocompleteMultiple',
    });
});
