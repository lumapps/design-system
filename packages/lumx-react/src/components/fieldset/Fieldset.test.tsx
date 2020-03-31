import { ShallowWrapper, shallow } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

import { Emphasis } from '@lumx/react';
import { CommonSetup } from '@lumx/react/testing/utils';
import { CLASSNAME, Fieldset, FieldsetProps } from './Fieldset';

interface ISetup extends CommonSetup {
    children: ShallowWrapper;
    fieldset: ShallowWrapper;
    legend: ShallowWrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param propOverrides An object that will extend the default properties.
 * @return An object with some shortcuts to elements or data required in tests.
 */
const setup = (propOverrides: Partial<FieldsetProps> = {}): ISetup => {
    const props = {
        children: <input type="text" name="input" />,
        legend: 'I am a legend',
        ...propOverrides,
    };
    const wrapper = shallow(<Fieldset {...props} />);
    const fieldset = wrapper.find('fieldset').first();

    return {
        children: fieldset.find('input'),
        fieldset,
        legend: fieldset.find('legend').first(),
        props,
        wrapper,
    };
};

describe('<Fieldset />', () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshot', () => {
        it('should render correctly Chip component', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { fieldset, legend, children }: ISetup = setup();

            expect(fieldset).toHaveClassName(CLASSNAME);
            expect(legend).toHaveLength(1);
            expect(children).toHaveLength(1);
        });

        it('should use the given text as legend', (): void => {
            const legendValue = 'I am a legend';
            const { legend }: ISetup = setup({
                legend: legendValue,
            });

            expect(legend).toHaveText(legendValue);
        });

        it('should use the given html as legend', (): void => {
            const legendContent = <span className="lumapps">Be bold</span>;
            const { legend }: ISetup = setup({
                legend: legendContent,
            });

            expect(legend).toHaveLength(1);
            expect(legend).toContainReact(legendContent);
        });

        it('should not have any child', (): void => {
            const { children }: ISetup = setup({
                children: null,
            });

            expect(children).toHaveLength(0);
        });

        it('should use the given className prop', (): void => {
            const { fieldset }: ISetup = setup({
                className: 'my-fieldset',
            });

            expect(fieldset).toHaveClassName(CLASSNAME);
            expect(fieldset).toHaveClassName('my-fieldset');
        });

        it('should add className if hasFirstInputWithElevation', (): void => {
            const { legend }: ISetup = setup({
                hasFirstInputWithElevation: true,
            });

            expect(legend).toHaveClassName(`${CLASSNAME}--with-negative-margin-bottom`);
        });

        it('should add className if the emphasis is medium', (): void => {
            const { legend }: ISetup = setup({
                emphasis: Emphasis.medium,
            });

            expect(legend).toHaveClassName(`${CLASSNAME}--emphasis-medium`);
        });
    });

    // 3. Test events.
    // NA

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should not render the legend if none was provided', () => {
            const { legend } = setup({ legend: '' });
            expect(legend).toHaveLength(0);
        });
    });

    // 5. Test state.
    // N/A.
});
