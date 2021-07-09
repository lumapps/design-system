import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { List, ListItem, Size } from '@lumx/react';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { AutocompleteMultiple, AutocompleteMultipleProps } from './AutocompleteMultiple';

import { CITIES as suggestions } from './__mockData__';

const CLASSNAME = AutocompleteMultiple.className as string;

type SetupProps = Partial<AutocompleteMultipleProps>;

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
    const wrapper: Wrapper = renderer(<AutocompleteMultiple {...props} />);

    return { props, wrapper };
};

describe(`<${AutocompleteMultiple.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
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
                label: 'Field label',
                isOpen: true,
                isRequired: true,
                onChange: jest.fn(),
                value: '',
            });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
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
