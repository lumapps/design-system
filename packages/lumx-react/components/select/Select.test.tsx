import React, { ReactElement, RefObject } from 'react';

import { mount, shallow } from 'enzyme';

import { Chip, Icon } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/core/testing/utils.test';
import { getBasicClass } from '@lumx/core/utils';

import { mdiCloseCircle, mdiMenuDown } from '@mdi/js';
import { Theme } from 'LumX/components';
import { Dropdown } from 'LumX/components/dropdown/react/Dropdown';
import { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, SelectVariant } from './Select';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<SelectProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * [Enter the description of this wrapper].
     * [You should also probably change the name of the wrapper to something more meaningful].
     */
    input: Wrapper;
    dropdown: Wrapper;
    container: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: SelectProps = {
        children: <span>Select Component</span>,
        value: [],
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Select {...props} />);

    return {
        container: wrapper.find('div').first(),
        dropdown: wrapper.find(Dropdown),
        input: wrapper.find('#uuid'),
        props,
        wrapper,
    };
};

describe(`<${Select.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
            const { container, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(container).toExist();
            expect(container).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Here are some examples of basic props check.

        it('should have default classNames', (): void => {
            const { wrapper, container }: ISetup = setup();
            wrapper.update();

            expect(container).toHaveClassName(CLASSNAME);
            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme }),
            );
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isEmpty', value: true }));
        });

        it('should use the given `theme`', (): void => {
            const testedProp = 'theme';
            const modifiedProps: ISetupProps = {
                [testedProp]: Theme.dark,
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
            expect(container).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: DEFAULT_PROPS.theme }),
            );
        });

        it('should use the given `isValid`', (): void => {
            const testedProp = 'isValid';
            const modifiedProps: ISetupProps = {
                [testedProp]: true,
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
        });

        it('should use the given `hasError`', (): void => {
            const testedProp = 'hasError';
            const modifiedProps: ISetupProps = {
                [testedProp]: true,
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
        });

        it('should use the given `value`', (): void => {
            const testedProp = 'value';
            const modifiedProps: ISetupProps = {
                [testedProp]: [''],
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasUnique', value: true }));
            expect(container).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'hasMultiple', value: true }),
            );
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasValue', value: true }));
            expect(container).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isEmpty', value: true }));
        });

        it('should use the given `isMultiple`', (): void => {
            const testedProp = 'isMultiple';
            const modifiedProps: ISetupProps = {
                [testedProp]: true,
                value: ['', ''],
            };

            const { container } = setup(modifiedProps);

            expect(container).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasUnique', value: true }));
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasMultiple', value: true }));
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasValue', value: true }));
            expect(container).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isEmpty', value: true }));
        });

        it('should pass the given `onDropdownClose` to the dropdown', (): void => {
            const onDropdownClose = jest.fn();
            const { dropdown } = setup({ onDropdownClose });

            expect(dropdown).toHaveProp('onClose', onDropdownClose);
        });

        it('should pass the given `isOpen` to the dropdown', (): void => {
            const isOpen = true;
            const { dropdown } = setup({ isOpen });

            expect(dropdown).toHaveProp('showDropdown', isOpen);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Here is an example how to check a `onClick` event.

        const onClick: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onClick.mockClear();
            },
        );

        describe('should trigger `onInputClick` when the select button is clicked', (): void => {
            it('with input variant', (): void => {
                const { input } = setup({ onInputClick: onClick, variant: SelectVariant.input });

                input.simulate('click');

                expect(onClick).toHaveBeenCalled();
            });

            it('with chip variant', (): void => {
                const { input } = setup({ onInputClick: onClick, variant: SelectVariant.chip });

                input.simulate('click');

                expect(onClick).toHaveBeenCalled();
            });
        });

        it('should call onClear when clear icon is clicked in select input', (): void => {
            const value = 'Value';
            const onClear: jest.Mock = jest.fn();
            const { input } = setup({ value: [value], onClear });

            input
                .find(`.${CLASSNAME}__input-clear`)
                .first()
                .simulate('click');
            expect(onClear).toHaveBeenCalled();
        });

        it('should call onClear when a chip is clicked with the correct value', (): void => {
            const value1 = 'Value 1';
            const value2 = 'Value 2';

            const onClear: jest.Mock = jest.fn();
            const { input } = setup({
                isMultiple: true,
                onClear,
                value: [value1, value2],
            });

            const fakeEvent = new Event('click');
            input
                .find(Chip)
                .first()
                .simulate('click', fakeEvent);
            expect(onClear).toHaveBeenCalledWith(fakeEvent, value1);
        });

        it('should call onClear when Chip onAfterClick is triggered with chip variant', (): void => {
            const value1 = 'Value 1';
            const value2 = 'Value 2';
            const onClear: jest.Mock = jest.fn();

            const { input } = setup({
                isMultiple: true,
                onClear,
                value: [value1, value2],
                variant: SelectVariant.chip,
            });

            expect(input.prop('onAfterClick')).toBe(onClear);
        });
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        describe('Input variant', (): void => {
            it('should render a div as the select input', (): void => {
                const { dropdown, input } = setup({}, false);
                const dropdownRef: RefObject<HTMLDivElement> = dropdown.prop('anchorRef');
                expect(input.type()).toBe('div');
                // Impossible to get the ref passed to a div so we check if ref.current is matching the input html.
                expect(input.html()).toEqual(dropdownRef && dropdownRef.current && dropdownRef.current.outerHTML);
            });

            describe('Has value', (): void => {
                const value = 'Value';
                const hasValueProps: Partial<ISetupProps> = {
                    value: [value],
                    variant: SelectVariant.input,
                };

                it('should render the value selected if not multiple ', (): void => {
                    const { input } = setup({ ...hasValueProps });

                    expect(
                        input
                            .find(`.${CLASSNAME}__input-native span`)
                            .first()
                            .text(),
                    ).toBe(value);
                });
            });

            describe('Has multiple values', (): void => {
                const value1 = 'Value1';
                const value2 = 'Value2';
                const value3 = 'Value3';
                const hasMultipleValues: Partial<ISetupProps> = {
                    isMultiple: true,
                    value: [value1, value2, value3],
                    variant: SelectVariant.input,
                };

                it('should render the values selected in Chips if multiple ', (): void => {
                    const { input, props } = setup({ ...hasMultipleValues });

                    expect(input.find(Chip).length).toBe(props.value!.length);
                    expect(
                        input
                            .find(Chip)
                            .at(0)
                            .children()
                            .text(),
                    ).toBe(props.value![0]);
                    expect(
                        input
                            .find(Chip)
                            .at(1)
                            .children()
                            .text(),
                    ).toBe(props.value![1]);
                    expect(
                        input
                            .find(Chip)
                            .at(2)
                            .children()
                            .text(),
                    ).toBe(props.value![2]);
                });
            });

            describe('No value', (): void => {
                const placeholder = 'My placeholder';
                const hasNoValueProps: Partial<ISetupProps> = {
                    placeholder,
                    value: [],
                    variant: SelectVariant.input,
                };

                it('should render the placeholder when empty', (): void => {
                    const { input } = setup({ ...hasNoValueProps });

                    expect(
                        input
                            .find(`.${CLASSNAME}__input-native--placeholder span`)
                            .first()
                            .text(),
                    ).toBe(placeholder);
                });
            });
        });

        describe('Chip variant', (): void => {
            it('should render a Chip as the select input', (): void => {
                const { dropdown, input } = setup({ variant: SelectVariant.chip });

                expect(input.type()).toEqual(Chip);
                expect(input.prop('chipRef')).toBe(dropdown.prop('anchorRef'));
            });

            describe('Has value', (): void => {
                const value = 'Value';
                const hasValueProps: Partial<ISetupProps> = {
                    value: [value],
                    variant: SelectVariant.chip,
                };

                it('should render the value', (): void => {
                    const label = 'The label';
                    const { input } = setup({
                        ...hasValueProps,
                        label,
                    });

                    expect(input.childAt(0).text()).toEqual(value);
                });

                it('should render the value even if isMultiple is true', (): void => {
                    const label = 'The label';
                    const { input } = setup({
                        ...hasValueProps,
                        isMultiple: true,
                        label,
                    });

                    expect(input.childAt(0).text()).toEqual(value);
                });

                it('should render a close icon if there is a value', (): void => {
                    const { input } = setup({ ...hasValueProps }, false);

                    expect(
                        input
                            .find(Icon)
                            .first()
                            .prop('icon'),
                    ).toBe(mdiCloseCircle);
                });
            });

            describe('Has multiple values', (): void => {
                const value1 = 'Value1';
                const value2 = 'Value2';
                const value3 = 'Value3';
                const hasMultipleValues: Partial<ISetupProps> = {
                    isMultiple: true,
                    value: [value1, value2, value3],
                    variant: SelectVariant.chip,
                };

                it('should render the value and additional text if multiple values', (): void => {
                    const label = 'The label';
                    const { input, props } = setup({
                        ...hasMultipleValues,
                        label,
                    });

                    expect(input.childAt(0).text()).toEqual(`${props.value![0]}\u00A0+${props.value!.length - 1}`);
                });
            });

            describe('No value', (): void => {
                const hasNoValue: Partial<ISetupProps> = {
                    value: [],
                    variant: SelectVariant.chip,
                };

                it('should render the label', (): void => {
                    const label = 'The label';
                    const { input } = setup({ ...hasNoValue, label });

                    expect(input.childAt(0).text()).toEqual(label);
                });

                it('should render a MenuDown icon', (): void => {
                    const { input } = setup({ ...hasNoValue }, false);

                    expect(
                        input
                            .find(Icon)
                            .first()
                            .prop('icon'),
                    ).toBe(mdiMenuDown);
                });
            });
        });
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
