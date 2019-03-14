import { LxButtonProps } from './LxButton';

/////////////////////////////

import React, { Children, cloneElement } from 'react';

import classNames from 'classnames';

import { CLASSNAME as LXBUTTON_CLASSNAME, LxButton } from './LxButton';

/////////////////////////////

/**
 * Displays an icon button.
 * It's like a LxButton but displays an icon instead of a label in the body of the button.
 *
 * @see {@link LxButton} for more information on LxButton.
 *
 * @return {JSX.Element} The LxIconButton component.
 */
const LxIconButton: React.FC<LxButtonProps> = ({ children, ...props }: LxButtonProps): JSX.Element => (
    <LxButton className="lx-button--shape-circled" {...props}>
        {/* [XXX] Clement: Type of `icon` should be React.ReactElement<LxIconProps>, but I didn't managed to make it work. */}
        {Children.map(children, (icon: any) =>
            cloneElement(icon, {
                className: classNames(icon.props.className, `${LXBUTTON_CLASSNAME}__icon`),
            }),
        )}
    </LxButton>
);

/////////////////////////////

export { LxIconButton };
