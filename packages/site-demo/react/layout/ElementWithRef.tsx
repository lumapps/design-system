import React, { RefObject } from 'react';

const ElementWithRef = ({
    type = 'div',
    elementRef,
    ...props
}: {
    type?: string;
    elementRef: RefObject<HTMLElement>;
}): React.ReactElement => React.createElement(type, { ...props, ref: elementRef });

export { ElementWithRef };
