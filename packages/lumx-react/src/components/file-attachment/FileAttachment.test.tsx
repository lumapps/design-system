import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mdiFile, mdiFilePdfBox } from '@lumx/icons';
import { Theme } from '..';
import { CLASSNAME, DEFAULT_PROPS, FileAttachment, FileAttachmentProps } from './FileAttachment';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<FileAttachmentProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The wrapper of the file attachment.
     */
    wrapper: Wrapper;
    /**
     * The thumbnail of the file attachment.
     */
    thumbnail: Wrapper;
    /**
     * The icon of the file attachment.
     */
    icon: Wrapper;
    /**
     * The Link containing the file name.
     */
    fileNameLink: Wrapper;
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
    const wrapper: Wrapper = renderer(<FileAttachment {...props} />);

    return {
        fileNameLink: wrapper.find(`.${CLASSNAME}__link`),
        icon: wrapper.find('Icon'),
        props,
        thumbnail: wrapper.find('Thumbnail'),
        wrapper,
    };
};

describe(`<${FileAttachment.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { wrapper, icon } = setup();
            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
            expect(icon).toHaveProp('icon', mdiFile);
        });

        it('should pass the theme to the Icon', () => {
            const expectedTheme = Theme.dark;
            const { icon } = setup({ theme: expectedTheme });
            expect(icon).toHaveProp('theme', expectedTheme);
        });

        it('should pass the icon to the Icon component', () => {
            const expectedIcon = mdiFilePdfBox;
            const { icon } = setup({
                icon: {
                    icon: expectedIcon,
                },
            });
            expect(icon).toHaveProp('icon', expectedIcon);
        });

        it('should display the file name correctly', () => {
            const expectedFileName = 'test.pdf';
            const { fileNameLink } = setup({
                url: 'https://sometest.url/path/to/file/test.pdf',
            });
            expect(fileNameLink).toHaveProp('children', expectedFileName);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        const expectedUrl = 'https://expected.url';
        const { thumbnail } = setup({
            thumbnail: {
                image: 'path/to/test.png',
            },
            url: expectedUrl,
        });
        window.open = jest.fn();
        thumbnail.simulate('click');
        expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should display Thumbnail and no Icon if thumbnail is defined', () => {
            const { icon, thumbnail } = setup({ thumbnail: { image: 'Pouet' } });
            expect(thumbnail).toExist();
            expect(icon).not.toExist();
        });

        it('should display Icon and no Thumbnail if thumbnail is not defined', () => {
            const { icon, thumbnail } = setup({ icon: { icon: mdiFilePdfBox } });
            expect(icon).toExist();
            expect(thumbnail).not.toExist();
        });
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
