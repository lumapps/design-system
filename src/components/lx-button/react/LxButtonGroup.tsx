import { LxButtonProps } from './LxButton';

/////////////////////////////

import React from 'react';

import { CLASSNAME as LXBUTTON_CLASSNAME } from './LxButton';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps {
    /**
     * Basic react `children` prop.
     */
    children: React.ReactNode;
}

/////////////////////////////

/**
 * Displays group of LxButtons.
 *
 * @see {@link LxButton} for more information on LxButton.
 *
 * @return {JSX.Element} The LxButtonGroup component.
 */
const LxButtonGroup: React.FC<LxButtonProps> = ({ children }: IProps): JSX.Element => (
    <div className={`${LXBUTTON_CLASSNAME}-group`}>{children}</div>
);

/////////////////////////////

export { LxButtonGroup };
