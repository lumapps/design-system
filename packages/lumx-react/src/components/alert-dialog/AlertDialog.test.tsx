import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, itShouldRenderStories, Wrapper } from '@lumx/react/testing/utils';
import { AlertDialog, AlertDialogProps } from './AlertDialog';
import * as stories from './AlertDialog.stories';

jest.mock('uid', () => ({ uid: () => 'uid' }));

const CLASSNAME = AlertDialog.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: Partial<AlertDialogProps> = {}, shallowRendering = true) => {
    const props: AlertDialogProps = {
        title: 'Alert',
        description: 'Deserunt et sunt qui consequat sint sit.',
        confirmProps: { onClick: () => alert('confirm'), label: 'OK' },
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<AlertDialog {...props} />);

    return {
        AlertDialog: wrapper.find(`Dialog`),
        props,
        wrapper,
    };
};

describe(`<${AlertDialog.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, AlertDialog);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'AlertDialog', prop: 'AlertDialog' }, { className: CLASSNAME });
});
