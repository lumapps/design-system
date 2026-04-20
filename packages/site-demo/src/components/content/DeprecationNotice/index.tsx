import React from 'react';
import { Message } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

interface DeprecationNoticeProps {
    children: React.ReactNode;
}

/** Standard deprecation warning banner for deprecated component pages. */
export const DeprecationNotice: React.FC<DeprecationNoticeProps> = ({ children }) => (
    <Message kind="warning" hasBackground className={classNames.margin('vertical')}>
        {children}
    </Message>
);
