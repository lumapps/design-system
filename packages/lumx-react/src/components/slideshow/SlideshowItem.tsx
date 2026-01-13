import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SlideshowItemProps extends GenericProps {
    /** interval in which slides are automatically shown */
    interval?: number;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SlideshowItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-slideshow-item';

/**
 * SlideshowItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SlideshowItem = forwardRef<SlideshowItemProps, HTMLDivElement>((props, ref) => {
    const { className, children, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);
    return (
        <div ref={ref} className={block([className])} {...forwardedProps}>
            {children}
        </div>
    );
});

SlideshowItem.displayName = COMPONENT_NAME;
SlideshowItem.className = CLASSNAME;
