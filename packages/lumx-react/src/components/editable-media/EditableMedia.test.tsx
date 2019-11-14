import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { Size } from '@lumx/react';
import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils.test';
import { CLASSNAME, EditableMedia, EditableMediaProps, EditableMediaVariant } from './EditableMedia';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<EditableMediaProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props and the component wrapper.
 */
const setup = ({ ...props }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<EditableMedia {...props} />);

    return { props, wrapper };
};

describe(`<${EditableMedia.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render EditableMedia without label or helper', () => {
            const { wrapper } = setup();

            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should render EditableMedia with label', () => {
            const label = 'Test Label';
            const { wrapper } = setup({ label });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia with helper', () => {
            const helper = 'Test Helper';
            const { wrapper } = setup({ helper });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia with placeholder', () => {
            const placeholder = 'Test Placeholder';
            const { wrapper } = setup({ placeholder });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia with given size', () => {
            const size = Size.xl;
            const { wrapper } = setup({ size });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia with Avatar variant', () => {
            const variant = EditableMediaVariant.avatar;
            const image = 'http://localhost/fakeImg.svg';
            const { wrapper } = setup({ image, variant });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia with an image', () => {
            const image = 'http://localhost/fakeImg.svg';
            const { wrapper } = setup({ image });

            expect(wrapper).toMatchSnapshot();
        });

        it('should not render EditableMedia children if no image is displayed', () => {
            const children = <div>I am the test child !</div>;
            const { wrapper } = setup({ children });

            expect(wrapper).toMatchSnapshot();
        });

        it('should render EditableMedia children if image is displayed', () => {
            const children = <div>I am the other test child</div>;
            const image = 'http://localhost/fakeImage.svg';
            const { wrapper } = setup({ children, image });

            expect(wrapper).toMatchSnapshot();
        });

        it('should forward any CSS class', (): void => {
            const props: Partial<EditableMediaProps> = { className: 'component component--is-tested' };
            const { wrapper } = setup(props);

            expect(wrapper).toMatchSnapshot();
        });

        it('should forward any other prop', (): void => {
            const testProperty = {};
            const { wrapper } = setup({ testProperty });

            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
