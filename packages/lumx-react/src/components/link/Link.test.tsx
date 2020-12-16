import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ColorPalette, ColorVariant, Typography } from '@lumx/react';
import { CommonSetup, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { Link, LinkProps } from './Link';

const CLASSNAME = Link.className as string;

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<LinkProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true): Setup => {
    const props: LinkProps = {
        ...propsOverride,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Link {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${Link.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup({ href: 'https://google.com' });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render color & color variant', () => {
            const { wrapper } = setup({
                href: 'https://google.com',
                color: ColorPalette.primary,
                colorVariant: ColorVariant.D1,
            });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render typography', () => {
            const { wrapper } = setup({ href: 'https://google.com', typography: Typography.title });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render a button if href attribute is missing', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // Common tests suite.
    commonTestsSuite(
        setup,
        { className: 'wrapper', prop: 'wrapper' },
        { className: CLASSNAME, prop: 'href', propValue: 'https://google.com' },
    );
});
