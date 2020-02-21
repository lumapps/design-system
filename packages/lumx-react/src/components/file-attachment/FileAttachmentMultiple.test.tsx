import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mdiFile, mdiFilePdfBox } from '@lumx/icons';
import { Theme } from '..';
import {
    CLASSNAME,
    DEFAULT_PROPS,
    FileAttachmentMultiple,
    FileAttachmentMultipleProps,
} from './FileAttachmentMultiple';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<FileAttachmentMultipleProps>;

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
     * The ListItem components.
     */
    listItems: Wrapper;
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
    const wrapper: Wrapper = renderer(<FileAttachmentMultiple {...props} />);

    return {
        listItems: wrapper.find('ListItem'),
        props,
        wrapper,
    };
};

const files = [
    {
        thumbnail: { image: 'https://loremflickr.com/320/240' },
        url: 'https://cdn.com/api/pdf/presentation-2020.pdf',
    },
    {
        icon: { icon: mdiFilePdfBox },
        url: 'https://cdn.com/api/pdf/presentation-2020-2.pdf',
    },
    {
        url: 'https://cdn.com/api/pdf/presentation-2020-3.pdf',
    },
];

describe(`<${FileAttachmentMultiple.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup({
                files,
            });
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
            const { wrapper } = setup({ files });
            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should pass the theme to the Icons', () => {
            const expectedTheme = Theme.dark;
            const { listItems } = setup({ files, theme: expectedTheme }, false);
            listItems.find('Icon').forEach((icon: Wrapper) => {
                expect(icon).toHaveProp('theme', expectedTheme);
            });
        });

        it('should pass the corresponding classNames to the Icons', () => {
            const expectedClassName = ['test-1', 'test-2'];
            const { listItems } = setup(
                {
                    files: [
                        {
                            icon: { icon: mdiFile, className: 'test-1' },
                            url: 'https://sometest.url/path/to/file/test1.pdf',
                        },
                        {
                            icon: { icon: mdiFile, className: 'test-2' },
                            url: 'https://sometest.url/path/to/file/test2.pdf',
                        },
                    ],
                },
                false,
            );
            listItems.forEach((listItem: Wrapper, index: number) => {
                expect(listItem.find('Icon')).toHaveClassName(expectedClassName[index]);
            });
        });

        it('should display the files names correctly', () => {
            const expectedFileNames = ['test.pdf', 'test2.pdf'];
            const { listItems } = setup({
                files: [
                    { url: 'https://sometest.url/path/to/file/test.pdf' },
                    { url: 'https://sometest.url/path/to/file/test2.pdf' },
                ],
            });
            listItems.forEach((listItem: Wrapper, index: number) => {
                expect(listItem.find('Link')).toHaveProp('children', expectedFileNames[index]);
            });
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        it('should open the corresponding link in a new tab when you click on Thumbnail or Icon', () => {
            const { listItems } = setup(
                {
                    files,
                },
                false,
            );
            window.open = jest.fn();
            listItems.forEach((listItem: Wrapper, index: number) => {
                const thumbnail = listItem.find('Thumbnail');
                const beforeElement = thumbnail.exists() ? thumbnail : listItem.find('Icon');

                if (beforeElement.exists()) {
                    beforeElement.simulate('click');

                    expect(window.open).toHaveBeenCalledWith(files[index].url, '_blank');
                }
            });
        });
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should display Thumbnail if thumbnail is defined and Icon if not', () => {
            const { wrapper } = setup({ files }, false);

            expect(wrapper.find('Icon').length).toBe(2);
            expect(wrapper.find('Thumbnail').length).toBe(1);
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
