import type { HasClassName, JSXElement, LumxClassName } from '../../types';
import { FitAnchorWidth, type Placement } from '../Popover/constants';
import { classNames } from '../../utils';
import { PopoverProps } from '../Popover';
import { ScrollBox } from '../ScrollBox';

/** MenuPopover props. */
export interface MenuPopoverProps
    extends HasClassName,
        Pick<PopoverProps, 'placement' | 'anchorRef' | 'isOpen' | 'handleClose' | 'fitToAnchorWidth'> {
    /** Popover content (a `Menu`). */
    children?: JSXElement;
}

/** Framework components injected by wrappers. */
export interface MenuPopoverComponents {
    /** Popover component (framework-specific). */
    Popover: any;
}

export const COMPONENT_NAME = 'MenuPopover';

export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-popover';
const { block, element } = classNames.bem(CLASSNAME);

/** MenuPopover core template. Renders a `Popover` with menu-friendly defaults. */
export const MenuPopover = (props: MenuPopoverProps, { Popover }: MenuPopoverComponents) => {
    const {
        children,
        className,
        isOpen,
        placement = 'bottom-start' as Placement,
        fitToAnchorWidth = FitAnchorWidth.MIN_WIDTH,
        anchorRef,
        handleClose,
        ...forwardedProps
    } = props;

    return (
        <Popover
            {...forwardedProps}
            placement={placement}
            anchorRef={anchorRef}
            isOpen={isOpen}
            onClose={handleClose}
            closeOnClickAway
            closeOnEscape
            usePortal={false}
            focusAnchorOnClose
            withFocusTrap={false}
            closeMode="hide"
            fitToAnchorWidth={fitToAnchorWidth}
            className={block([className])}
        >
            {ScrollBox({ className: element('scroll'), children })}
        </Popover>
    );
};
