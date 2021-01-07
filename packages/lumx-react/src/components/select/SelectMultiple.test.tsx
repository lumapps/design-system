import React, { ReactElement, RefObject } from 'react';

import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import 'jest-enzyme';

import { mdiCloseCircle, mdiMenuDown } from '@lumx/icons';
import { Kind, Theme } from '@lumx/react/components';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { Icon } from '@lumx/react/components/icon/Icon';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';
import { SelectMultiple, SelectMultipleProps } from './SelectMultiple';
import { DEFAULT_PROPS } from './WithSelectContext';
import { SelectVariant } from './constants';

const CLASSNAME = SelectMultiple.className as string;

jest.mock('uid', () => ({ uid: () => 'uid' }));

type SetupProps = Partial<SelectMultipleProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: SetupProps = {}, shallowRendering = true) => {
    const setupProps: SelectMultipleProps = {
        children: <span>Select Component</span>,
        value: [],
        ...props,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<SelectMultiple {...setupProps} />);

    return {
        container: wrapper.find('div').first(),
        dropdown: wrapper.find(Dropdown),
        error: wrapper
            .findWhere(
                (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === Kind.error,
            )
            .first(),
        helper: wrapper.findWhere(
            (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === Kind.info,
        ),
        input: wrapper.find('#select-uid:not(SelectMultipleField)').first(),
        props,
        wrapper,
    };
};

describe(`<SelectMultiple>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render chips', () => {
            const { wrapper } = setup({
                variant: SelectVariant.chip,
            });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('Props', () => {
        it('should have default classNames', () => {
            const { wrapper, container } = setup();
            wrapper.update();

            expect(container).toHaveClassName(CLASSNAME);
            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme }),
            );
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isEmpty', value: true }));
        });

        it('should use the given `theme`', () => {
            const testedProp = 'theme';
            const modifiedProps: SetupProps = {
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

        it('should use the given `isValid`', () => {
            const testedProp = 'isValid';
            const modifiedProps: SetupProps = {
                [testedProp]: true,
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
        });

        it('should use the given `hasError`', () => {
            const testedProp = 'hasError';
            const modifiedProps: SetupProps = {
                [testedProp]: true,
            };

            const { container } = setup(modifiedProps);

            expect(container).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
        });

        it('should display the given `error`', () => {
            const { container, error } = setup({
                error: 'You are not bold!',
                hasError: true,
            });

            expect(error).toExist();
            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasError', value: true }));
        });

        it('should NOT display the given `error`', () => {
            const { container, error } = setup({
                error: 'You are not bold!',
                hasError: false,
            });

            expect(error).not.toExist();
            expect(container).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasError', value: true }));
        });

        it('should use the given `value`', () => {
            const { container } = setup({
                value: [''],
            });

            expect(container).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'hasValue', value: true }));
            expect(container).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isEmpty', value: true }));
        });

        it('should trigger the given `onDropdownClose` on dropdown close', () => {
            const onDropdownClose = jest.fn();
            const { dropdown } = setup({ onDropdownClose });

            const props: any = dropdown.props();

            props.onClose();

            expect(onDropdownClose).toHaveBeenCalled();
        });

        it('should pass the given `isOpen` to the dropdown', () => {
            const isOpen = true;
            const { dropdown } = setup({ isOpen });

            expect(dropdown).toHaveProp('isOpen', isOpen);
        });

        it('should display the given `helper`', () => {
            const { helper } = setup({
                helper: 'Be bold',
            });

            expect(helper).toExist();
        });

        it('should display the given `helper` and `error`', () => {
            const { error, helper } = setup({
                error: 'You are not bold!',
                hasError: true,
                helper: 'Be bold',
            });

            expect(error).toExist();
            expect(helper).toExist();
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onClick: jest.Mock = jest.fn();

        beforeEach(() => {
            onClick.mockClear();
        });

        describe('should trigger `onInputClick` when the select button is clicked', () => {
            it('with input variant', () => {
                const { input } = setup({ onInputClick: onClick, variant: SelectVariant.input }, false);

                input.simulate('click');

                expect(onClick).toHaveBeenCalled();
            });

            it('with chip variant', () => {
                const { input } = setup({ onInputClick: onClick, variant: SelectVariant.chip }, false);

                input.simulate('click');

                expect(onClick).toHaveBeenCalled();
            });
        });

        it('should call onClear when an item is clicked with the correct value', () => {
            const onClear: jest.Mock = jest.fn();
            const { input } = setup(
                {
                    onClear,
                    value: ['val 1', 'val 2'],
                    variant: SelectVariant.input,
                    clearButtonProps: { label: 'Clear' },
                },
                false,
            );

            input.find('Chip').first().simulate('click');

            expect(onClear).toHaveBeenCalled();
        });

        it('should call onClear when a chip is clicked with the correct value', () => {
            const value1 = 'Value 1';
            const value2 = 'Value 2';

            const onClear: jest.Mock = jest.fn();
            const { input } = setup(
                {
                    onClear,
                    value: [value1, value2],
                    variant: SelectVariant.chip,
                    clearButtonProps: { label: 'Clear' },
                },
                false,
            );

            (input.find('Chip').first().props() as any).onAfterClick();

            expect(onClear).toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        describe('Input variant', () => {
            it('should render a div as the select input', () => {
                const { dropdown, input } = setup({}, false);
                const dropdownRef: RefObject<HTMLDivElement> = dropdown.prop('anchorRef');
                expect(input.type()).toBe('div');
                // Impossible to get the ref passed to a div so we check if ref.current is matching the input html.
                expect(input.html()).toEqual(dropdownRef && dropdownRef.current && dropdownRef.current.outerHTML);
            });

            describe('Has multiple values', () => {
                const value1 = 'Value1';
                const value2 = 'Value2';
                const value3 = 'Value3';
                const hasMultipleValues: Partial<SetupProps> = {
                    value: [value1, value2, value3],
                    variant: SelectVariant.input,
                };

                it('should render the values selected in Chips if multiple ', () => {
                    const { input, props } = setup({ ...hasMultipleValues }, false);

                    expect(input.find(Chip).length).toBe(props.value?.length);
                    expect(input.find(Chip).at(0).children().text()).toBe(props.value?.[0]);
                    expect(input.find(Chip).at(1).children().text()).toBe(props.value?.[1]);
                    expect(input.find(Chip).at(2).children().text()).toBe(props.value?.[2]);
                });
            });

            describe('No value', () => {
                const placeholder = 'My placeholder';
                const hasNoValueProps: Partial<SetupProps> = {
                    placeholder,
                    value: [],
                    variant: SelectVariant.input,
                };

                it('should render the placeholder when empty', () => {
                    const { input } = setup({ ...hasNoValueProps }, false);

                    expect(input.find(`.${CLASSNAME}__input-native--placeholder span`).first().text()).toBe(
                        placeholder,
                    );
                });
            });
        });

        describe('Chip variant', () => {
            it('should render a Chip as the select input', () => {
                const { input } = setup({ variant: SelectVariant.chip }, false);

                expect(input.type()).toEqual(Chip);
            });

            describe('Has value', () => {
                const value = 'Value';
                const hasValueProps: Partial<SetupProps> = {
                    value: [value],
                    variant: SelectVariant.chip,
                };

                it('should render the value', () => {
                    const label = 'The label';
                    const { input } = setup(
                        {
                            ...hasValueProps,
                            label,
                        },
                        false,
                    );

                    expect(input.find('.lumx-chip__label').text()).toEqual(value);
                });

                it('should render a close icon if there is a value', () => {
                    const { input } = setup({ ...hasValueProps }, false);

                    expect(input.find(Icon).first().prop('icon')).toBe(mdiCloseCircle);
                });
            });

            describe('Has multiple values', () => {
                const value = ['v1', 'v2', 'v3'];

                it('should render the value and additional text if multiple values', () => {
                    const { input } = setup(
                        {
                            label: 'The label',
                            value,
                            variant: SelectVariant.chip,
                        },
                        false,
                    );

                    expect(input.find('.lumx-chip__label').text()).toEqual(`${value[0]}\u00A0+${value.length - 1}`);
                });
            });

            describe('No value', () => {
                const hasNoValue: Partial<SetupProps> = {
                    value: [],
                    variant: SelectVariant.chip,
                };

                it('should render the label', () => {
                    const label = 'The label';
                    const { input } = setup({ ...hasNoValue, label }, false);

                    expect(input.find('.lumx-chip__label').text()).toEqual(label);
                });

                it('should render a MenuDown icon', () => {
                    const { input } = setup({ ...hasNoValue }, false);

                    expect(input.find(Icon).first().prop('icon')).toBe(mdiMenuDown);
                });
            });
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper' }, { className: CLASSNAME });
});
