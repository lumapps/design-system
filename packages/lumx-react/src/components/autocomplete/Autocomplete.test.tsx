import React from 'react';

import { Dropdown, List, ListItem, Size, TextField } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CITIES as suggestions } from './__mockData__';
import { Autocomplete, AutocompleteProps } from './Autocomplete';

const CLASSNAME = Autocomplete.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<AutocompleteProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(
        <Autocomplete {...(props as any)}>
            <List>
                {suggestions.map((suggestion) => (
                    <ListItem size={Size.tiny} key={suggestion.id}>
                        <div>{suggestion.text}</div>
                    </ListItem>
                ))}
            </List>
        </Autocomplete>,
        { wrapper },
    );
    const autocomplete = getByClassName(document.body, CLASSNAME);
    const textField = getByClassName(autocomplete, TextField.className as string);
    const getDropdown = () => queryByClassName(document.body, Dropdown.className as string);
    const inputNative = getByTagName(autocomplete, 'input');
    return { props, textField, getDropdown, autocomplete, inputNative };
};

describe(`<${Autocomplete.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { autocomplete, textField, getDropdown } = setup();

            expect(autocomplete.className).toMatchInlineSnapshot('"lumx-autocomplete"');
            expect(textField).toBeInTheDocument();
            expect(getDropdown()).not.toBeInTheDocument();
        });

        it('should render open', () => {
            const { getDropdown } = setup({ isOpen: true });
            expect(getDropdown()).toBeInTheDocument();
        });
    });

    describe('Events', () => {
        it('should trigger the onChange callback when there is a change on the Text Field', async () => {
            const name = 'autocomplete-name';
            const onChange = vi.fn();
            const { inputNative } = setup({
                name,
                onChange,
            });

            await userEvent.tab();
            expect(inputNative).toHaveFocus();
            await userEvent.keyboard('a');

            // (text, name, event)
            expect(onChange).toHaveBeenCalledWith('a', name, expect.any(Object));
        });

        it('should trigger the onFocus/onBlur callback when the text field is focused and blurred', async () => {
            const onFocus = vi.fn();
            const onBlur = vi.fn();
            const { inputNative } = setup({
                onFocus,
                onBlur,
            });

            await userEvent.tab();
            expect(inputNative).toHaveFocus();
            expect(onFocus).toHaveBeenCalled();

            await userEvent.tab();
            expect(inputNative).not.toHaveFocus();
            expect(onBlur).toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'autocomplete',
        forwardAttributes: 'autocomplete',
        forwardRef: 'autocomplete',
        applyTheme: {
            affects: [{ element: 'textField' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
