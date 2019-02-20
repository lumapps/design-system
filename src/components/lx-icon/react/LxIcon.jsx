import React from 'react';
import classNames from 'classnames';

import '../style/lx-icon.scss';

import { handleBasicClasses } from '../../../core/utils';

export const LxIcon = ({ className, icon, color, size }) => {
    return (
        icon && (
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
        )
    );
};
