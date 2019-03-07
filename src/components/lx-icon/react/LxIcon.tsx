import React from 'react';

import classNames from 'classnames';

import '../style/lx-icon.scss';

import { handleBasicClasses } from 'core/utils';

interface ILxIconProps {
    /** The icon path to set in the html svg `d` property */
    icon: string;
    /** Basic React `className` property. */
    className?: string;
    /** The icon color which must be defined by `lx-icon--${color}` css class. */
    color?: string;
    /** The icon size which must be defined by `lx-icon--${size}` css class. */
    size?: string;
}

/**
 * Displays an html svg tag.
 *
 * @return {React.FC<ILxIconProps>} The icon component
 */
export const LxIcon: React.FC<ILxIconProps> = ({ icon, className, color, size }) => (
    <i className={classNames(className, handleBasicClasses({ color, size, prefix: 'lx-icon' }))}>
        <svg
            aria-hidden="true"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            style={{ verticalAlign: '-0.125em' }}
            viewBox="0 0 24 24"
            width="1em"
        >
            <path d={icon} fill="currentColor" />
        </svg>
    </i>
);
