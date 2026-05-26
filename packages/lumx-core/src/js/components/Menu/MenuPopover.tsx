import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import type { Placement } from '../Popover/constants';
import { classNames } from '../../utils';

/** MenuPopover props. */
export interface MenuPopoverProps extends HasClassName {
    /** Popover content (a `Menu`). */
    children?: JSXElement;
    /** Whether the popover is open. */
    isOpen?: boolean;
    /** Placement relative to the anchor. Defaults to `'bottom-start'`. */
    placement?: Placement;
    /** Reference to the anchor element. */
    anchorRef?: CommonRef;
    /** Callback invoked when the popover requests to close (click away, escape). */
    handleClose?(): void;
    /** Whether the popover should close when clicking outside. Default: true. */
    closeOnClickAway?: boolean;
    /** Whether the popover should close on Escape. Default: true. */
    closeOnEscape?: boolean;
    /** Whether to render in a portal. Default: false (avoid stacking-context surprises). */
    usePortal?: boolean;
    /** Whether to focus the anchor on close. Default: true. */
    focusAnchorOnClose?: boolean;
}

/** Framework components injected by wrappers. */
export interface MenuPopoverComponents {
    /** Popover component (framework-specific). */
    Popover: any;
    /** FlexBox component (framework-specific). */
    FlexBox: any;
}

export const COMPONENT_NAME = 'MenuPopover';

export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-popover';
const { block, element } = classNames.bem(CLASSNAME);

/** MenuPopover core template. Renders a `Popover` with menu-friendly defaults. */
export const MenuPopover = (props: MenuPopoverProps, { Popover, FlexBox }: MenuPopoverComponents) => {
    const {
        children,
        className,
        isOpen,
        placement = 'bottom-start' as Placement,
        anchorRef,
        handleClose,
        closeOnClickAway = true,
        closeOnEscape = true,
        usePortal = false,
        focusAnchorOnClose = true,
        ...forwardedProps
    } = props;

    return (
        <Popover
            {...forwardedProps}
            placement={placement}
            anchorRef={anchorRef}
            isOpen={isOpen}
            onClose={handleClose}
            closeOnClickAway={closeOnClickAway}
            closeOnEscape={closeOnEscape}
            usePortal={usePortal}
            focusAnchorOnClose={focusAnchorOnClose}
            withFocusTrap={false}
            closeMode="hide"
            fitToAnchorWidth={false}
            className={block([className])}
        >
            <FlexBox orientation="vertical" className={element('scroll')}>
                {children}
            </FlexBox>
        </Popover>
    );
};
