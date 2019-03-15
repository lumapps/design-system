import React, { Children } from 'react';

import { isElementOfType } from 'LumX/core/react/utils';

import { CLASSNAME as LXBUTTON_CLASSNAME, LxButton } from './LxButton';

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
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxButtonGroup> component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {IProps}  props The children and props of the <LxButtonGroup> component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate({ children }: IProps): React.ReactNode {
    Children.forEach(
        children,
        (child: any): void => {
            if (!isElementOfType(child, LxButton)) {
                throw new Error(`You can only have <LxButton>s child in a <LxButtonGroup> (got ${child.type})!`);
            }
        },
    );

    return children;
}

/////////////////////////////

/**
 * Displays a group of <LxButton>s.
 *
 * @see {@link LxButton} for more information on <LxButton>.
 *
 * @return {JSX.Element} The <LxButtonGroup> component.
 */
const LxButtonGroup: React.FC<IProps> = ({ children }: IProps): JSX.Element => {
    _validate({ children });

    return <div className={`${LXBUTTON_CLASSNAME}-group`}>{children}</div>;
};
LxButtonGroup.displayName = 'LxButtonGroup';

/////////////////////////////

export { LxButtonGroup };
