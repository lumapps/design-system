import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { List, ListItem, ListItemSize } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';

import { AutocompleteMultiple, AutocompleteMultipleProps, CLASSNAME } from './AutocompleteMultiple';

import { CITIES as suggestions } from './__mockData__';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<AutocompleteMultipleProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that holds the popover content displayed by the autocomplete
     */
    wrapper: Wrapper;
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
    const wrapper: Wrapper = renderer(<AutocompleteMultiple {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${AutocompleteMultiple.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
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
                chips: [
                    {
                        id: 'lyon',
                        text: 'Lyon',
                    },
                    {
                        id: 'montevideo',
                        text: 'Montevideo',
                    },
                ],
                isOpen: true,
                onChange: jest.fn(),
                value: '',
            });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
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
