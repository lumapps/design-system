import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { List, ListItem, Size } from '@lumx/react';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { Autocomplete, AutocompleteProps } from './Autocomplete';

import { CITIES as suggestions } from './__mockData__';

const CLASSNAME = Autocomplete.className as string;

type SetupProps = Partial<AutocompleteProps>;

interface Suggestion {
    id: string;
    text: string;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Autocomplete {...props} />);

    const textField: Wrapper = wrapper.find('TextField');
    const dropdown: Wrapper = wrapper.find('Dropdown');

    return { dropdown, props, textField, wrapper };
};

describe(`<${Autocomplete.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper, textField, dropdown } = setup({
                children: (
                    <List isClickable>
                        {suggestions.map((suggestion: Suggestion) => (
                            <ListItem size={Size.tiny} key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                label: 'Field label',
                isOpen: true,
                isRequired: true,
                onChange: jest.fn(),
                value: '',
            });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(wrapper).toHaveClassName(CLASSNAME);

            expect(textField).toHaveLength(1);
            expect(dropdown).toHaveLength(1);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { wrapper } = setup();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render correctly when the dropdown is closed', () => {
            const { wrapper } = setup({
                children: (
                    <List isClickable>
                        {suggestions.map((suggestion: Suggestion) => (
                            <ListItem size={Size.tiny} key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                isOpen: false,
                onChange: jest.fn(),
                value: '',
            });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 3. Test events.
    describe('Events', () => {
        it('should trigger the onChange callback when there is a change on the Text Field', () => {
            const onChange = jest.fn();
            const { textField } = setup({
                children: (
                    <List isClickable>
                        {suggestions.map((suggestion: Suggestion) => (
                            <ListItem size={Size.tiny} key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                isOpen: false,
                onChange,
                value: '',
            });

            textField.simulate('change');

            expect(onChange).toHaveBeenCalled();
        });

        it('should trigger the onFocus callback when the text field is focused on', () => {
            const onFocus = jest.fn();
            const { textField } = setup({
                children: (
                    <List isClickable>
                        {suggestions.map((suggestion: Suggestion) => (
                            <ListItem size={Size.tiny} key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                isOpen: false,
                onFocus,
                value: '',
            });

            textField.simulate('focus');

            expect(onFocus).toHaveBeenCalled();
        });

        it('should trigger the onBlur callback when the Text Field loses focus', () => {
            const onBlur = jest.fn();
            const { textField } = setup({
                children: (
                    <List isClickable>
                        {suggestions.map((suggestion: Suggestion) => (
                            <ListItem size={Size.tiny} key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                isOpen: false,
                onBlur,
                value: '',
            });

            textField.simulate('blur');

            expect(onBlur).toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
