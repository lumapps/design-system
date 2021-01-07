import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build, fake, oneOf } from 'test-data-bot';

import { mdiCheck, mdiPlus } from '@lumx/icons';
import { ColorPalette, ColorVariant, Size } from '@lumx/react';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Icon, IconProps } from './Icon';

const CLASSNAME = Icon.className as string;

type SetupProps = Partial<IconProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: IconProps = {
        icon: 'mdiPlus',
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Icon {...props} />);

    return {
        i: wrapper.find('i'),
        path: wrapper.find('path'),
        svg: wrapper.find('svg'),
        props,
        wrapper,
    };
};

describe(`<${Icon.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { i, path, svg, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(i).toExist();
            expect(i).toHaveClassName(CLASSNAME);

            expect(svg).toExist();
            expect(path).toExist();
        });

        it('should render color & color variant', () => {
            const { wrapper } = setup({ color: ColorPalette.primary, colorVariant: ColorVariant.D1 });
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it("shouldn't use any default props", () => {
            const { i } = setup();

            ['color', 'size'].forEach((prop: string) => {
                expect(i).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: '' }));
            });
        });

        it('should use the given props', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields({
                color: fake((fakeData: any) => fakeData.commerce.color()),
                icon: oneOf(mdiPlus, mdiCheck),
                size: oneOf(...Object.values(Size)),
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { i, path } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop: string) => {
                if (prop === 'icon') {
                    expect(path).toHaveProp('d', modifiedProps[prop]);
                } else {
                    expect(i).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                }
            });
        });
    });

    // 3. Test events.
    // N/A

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    // N/A

    // 5. Test state.
    // N/A

    // Common tests suite.
    commonTestsSuite(setup, { className: 'i', prop: 'i' }, { className: CLASSNAME });
});
