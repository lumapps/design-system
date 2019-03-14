import { Color, Size } from 'components';

/////////////////////////////

import React from 'react';

import classNames from 'classnames';

import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the LxIcon component.
 */
interface IProps {
    /**
     * The icon path to set in the HTML SVG `d` property
     */
    icon: string;

    /**
     * Basic React `className` property.
     */
    className?: string;

    /**
     * The icon color which must be defined by `lx-icon--${color}` css class.
     */
    color?: Color;

    /**
     * The icon size which must be defined by `lx-icon--${size}` css class.
     */
    size?: Size;
}
type LxIconProps = IProps;

/////////////////////////////

/**
 * Displays a HTML SVG tag with the wanted icon path.
 *
 * @return {JSX.Element} The LxIcon component
 */
const LxIcon: React.FC<IProps> = ({ icon, className, color, size }: IProps): JSX.Element => (
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

/////////////////////////////

export { LxIcon, LxIconProps };
