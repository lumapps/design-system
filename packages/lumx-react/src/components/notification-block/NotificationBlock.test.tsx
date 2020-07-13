import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';

import { CLASSNAME, NotificationBlock, NotificationBlockProps } from './NotificationBlock';
import * as stories from './NotificationBlock.stories';

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: Partial<NotificationBlockProps>;

    /**
     * The <div> element wrapper.
     */
    wrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = (
    { ...propsOverrides }: Partial<NotificationBlockProps> = {},
    shallowRendering: boolean = true,
): Setup => {
    const props: NotificationBlockProps = {
        date: '2min ago',
        description: 'Description message',
        title: 'Title',
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<NotificationBlock {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${NotificationBlock.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        expectStoriesToMatchSnapshots(stories, NotificationBlock);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
