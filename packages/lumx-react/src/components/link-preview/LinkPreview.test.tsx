import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';
import { Thumbnail } from '@lumx/react';

import { Size, Theme } from '..';
import { LinkPreview, LinkPreviewProps } from './LinkPreview';

const DEFAULT_PROPS = LinkPreview.defaultProps as any;
const CLASSNAME = LinkPreview.className as string;

type SetupProps = Partial<LinkPreviewProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<LinkPreview {...props} />);

    return {
        thumbnail: wrapper.find(Thumbnail),
        props,
        wrapper,
    };
};

describe(`<${LinkPreview.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render correctly', () => {
            const { wrapper } = setup({ size: Size.big });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { wrapper, thumbnail } = setup();
            ['size', 'theme'].forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
            expect(thumbnail).not.toExist();
        });

        it('should pass className prop to the wrapper', () => {
            const expectedClassName = 'must-be-set';
            const { wrapper } = setup({ className: expectedClassName });

            expect(wrapper).toHaveClassName(expectedClassName);
        });

        it('should set --theme-dark class variant on wrapper if theme = Theme.dark', () => {
            const { wrapper } = setup({ theme: Theme.dark });

            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: Theme.dark }));
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const expectedUrl = 'https://expected.url';
        const { thumbnail } = setup({
            link: expectedUrl,
            thumbnailProps: { image: 'https://expected.url/image.png', alt: 'Alt' },
        });
        window.open = jest.fn();

        thumbnail.simulate('click');

        expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank');
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
