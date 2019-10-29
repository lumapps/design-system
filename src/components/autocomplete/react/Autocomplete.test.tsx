import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { List, ListItem, ListItemSize } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';

import { Autocomplete, AutocompleteProps, CLASSNAME } from './Autocomplete';

import { CITIES as suggestions } from './__mockData__';

/////////////////////////////

/**
 * Define the overriding properties expected by the `setup` function.
 */
type ISetupProps = Partial<AutocompleteProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that holds the autocomplete content.
     */
    wrapper: Wrapper;

    /**
     * Text Field component.
     */
    textField: Wrapper;

    /**
     * Dropdown component.
     */
    dropdown: Wrapper;
}

interface ISuggestion {
    id: number;
    text: string;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
    const wrapper: Wrapper = renderer(<Autocomplete {...props} />);

    const textField: Wrapper = wrapper.find('TextField');
    const dropdown: Wrapper = wrapper.find('Dropdown');

    return {
        dropdown,
        props,
        textField,
        wrapper,
    };
};

describe(`<${Autocomplete.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
            const { wrapper, textField, dropdown } = setup({
                children: (
                    <List>
                        {suggestions.map((suggestion: ISuggestion) => (
                            <ListItem size={ListItemSize.tiny} isClickable key={suggestion.id}>
                                <div>{suggestion.text}</div>
                            </ListItem>
                        ))}
                    </List>
                ),
                isOpen: true,
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

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { wrapper }: ISetup = setup();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render correctly when the dropdown is closed', (): void => {
            const { wrapper } = setup({
                children: (
                    <List>
                        {suggestions.map((suggestion: ISuggestion) => (
                            <ListItem size={ListItemSize.tiny} isClickable key={suggestion.id}>
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

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        it('should trigger the onChange callback when there is a change on the Text Field', (): void => {
            const onChange = jest.fn();
            const { textField } = setup({
                children: (
                    <List>
                        {suggestions.map((suggestion: ISuggestion) => (
                            <ListItem size={ListItemSize.tiny} isClickable key={suggestion.id}>
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

        it('should trigger the onFocus callback when the text field is focused on', (): void => {
            const onFocus = jest.fn();
            const { textField } = setup({
                children: (
                    <List>
                        {suggestions.map((suggestion: ISuggestion) => (
                            <ListItem size={ListItemSize.tiny} isClickable key={suggestion.id}>
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

        it('should trigger the onBlur callback when the Text Field loses focus', (): void => {
            const onBlur = jest.fn();
            const { textField } = setup({
                children: (
                    <List>
                        {suggestions.map((suggestion: ISuggestion) => (
                            <ListItem size={ListItemSize.tiny} isClickable key={suggestion.id}>
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
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
