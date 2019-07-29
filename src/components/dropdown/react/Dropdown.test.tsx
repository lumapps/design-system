import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';

import { CLASSNAME, Dropdown, DropdownProps } from './Dropdown';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<DropdownProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that holds the dropdown content.
     */
    dropdown: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const anchorRef = React.createRef<HTMLButtonElement>();
    const props: DropdownProps = {
        // tslint:disable-next-line no-unused
        anchorRef,
        children: <div>This is the content of the dropdown</div>,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Dropdown {...props} />);

    return {
        dropdown: wrapper.find('div').first(),

        props,
        wrapper,
    };
};

describe(`<${Dropdown.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { dropdown, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(dropdown).toExist();
            expect(dropdown).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { wrapper }: ISetup = setup();

            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
        const onClose: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onClose.mockClear();
            },
        );

        it('should trigger `onClose` when pressing `escape` key', (): void => {
            const { wrapper } = setup({ showDropdown: true, onClose, escapeClose: true }, false);

            wrapper.simulate('keydown', { keyCode: 27 });
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', (): void => {
            const { wrapper } = setup({ showDropdown: true, onClose, escapeClose: true }, false);

            wrapper.simulate('keydown', { keyCode: 26 });
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `escapeClose` set to `false`', (): void => {
            const { wrapper } = setup({ showDropdown: true, onClose, escapeClose: false }, false);

            wrapper.simulate('keydown', { keyCode: 27 });
            expect(onClose).not.toHaveBeenCalled();
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
    commonTestsSuite(setup, { className: 'dropdown', prop: 'dropdown' }, { className: CLASSNAME });
});
