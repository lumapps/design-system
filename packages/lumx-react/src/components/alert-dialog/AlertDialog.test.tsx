import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { AlertDialog, AlertDialogProps } from './AlertDialog';

jest.mock('uid', () => ({ uid: () => 'uid' }));

const CLASSNAME = AlertDialog.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<AlertDialogProps> = {}) => {
    const props: AlertDialogProps = {
        title: 'Alert',
        isOpen: true,
        description: 'Deserunt et sunt qui consequat sint sit.',
        confirmProps: { onClick: jest.fn(), label: 'OK' },
        ...propsOverride,
    };
    render(<AlertDialog {...props} />);
    const alertDialog = queryByClassName(document.body, CLASSNAME);
    return { alertDialog, props };
};

describe(`<${AlertDialog.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'alertDialog',
        forwardAttributes: 'alertDialog',
    });
});
