import React, { AriaAttributes, ReactNode } from 'react';

import { visuallyHidden, join } from '@lumx/core/js/utils/classNames';

export interface A11YLiveMessageProps {
    /** The message that will be read. */
    children?: ReactNode;
    /** Whether the message should be hidden */
    hidden?: boolean;
    /**
     * The type of message.
     * Default to "polite"
     * Assertive should only be used for messages than need immediate attention.
     */
    type?: AriaAttributes['aria-live'];
    /**
     * Indicates whether assistive technologies will present all, or only parts of, the changed region based on
     * the change notifications defined by the aria-relevant attribute.
     */
    atomic?: AriaAttributes['aria-atomic'];
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see atomic.
     */
    relevant?: AriaAttributes['aria-relevant'];
    /**
     * Whether the live region reads a current status or
     * raises an alert.
     * Only use `alert` for time sensitive information that should be read immediately
     * as it will interrupt anything being currently read.
     */
    role?: 'status' | 'alert';
    /** Scope, for  tracking purposes */
    scope?: string;
    /** Optionnal classname */
    className?: string;
}

/**
 * Live region to read a message to screen readers.
 * Messages can be "polite" and be read when possible or
 * "assertive" and interrupt any message currently be read. (To be used sparingly)
 *
 * More information here: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 *
 * @family A11Y
 * @param A11YLiveMessageProps
 * @returns A11YLiveMessage
 */
export const A11YLiveMessage: React.FC<A11YLiveMessageProps> = ({
    type = 'polite',
    atomic,
    role,
    hidden,
    relevant,
    children,
    className,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            className={join(hidden ? visuallyHidden() : undefined, className)}
            role={role}
            aria-live={type}
            aria-atomic={atomic}
            aria-relevant={relevant}
        >
            {children}
        </div>
    );
};
