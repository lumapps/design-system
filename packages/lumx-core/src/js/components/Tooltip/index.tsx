import type { CommonRef, HasClassName, HasCloseMode, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ARIA_LINK_MODES, TOOLTIP_ZINDEX } from './constants';

/** Position of the tooltip relative to the anchor element. */
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * Framework-agnostic tooltip props (shared between React and Vue wrappers).
 */
export interface TooltipProps extends HasCloseMode {
    /** Delay (in ms) before closing the tooltip. */
    delay?: number;
    /** Whether the tooltip is displayed even without the mouse hovering the anchor. */
    forceOpen?: boolean;
    /** Label text. */
    label?: string | null | false;
    /** Placement of the tooltip relative to the anchor. */
    placement?: TooltipPlacement;
    /** Choose how the tooltip text should link to the anchor */
    ariaLinkMode?: (typeof ARIA_LINK_MODES)[number];
    /** Z-index for the tooltip */
    zIndex?: number;
}

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TooltipProps> = {
    placement: 'bottom',
    closeMode: 'unmount',
    ariaLinkMode: 'aria-describedby',
    zIndex: TOOLTIP_ZINDEX,
};

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Tooltip';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tooltip';

const { block, element } = classNames.bem(CLASSNAME);

/**
 * Props for the TooltipPopup rendering component.
 */
export interface TooltipPopupProps extends HasClassName {
    /** Unique ID for the tooltip (used for ARIA linking) */
    id: string;
    /** Label text to display in the tooltip */
    label: string;
    /** Resolved placement position from floating-ui */
    position: string;
    /** Whether the tooltip is visually hidden (closeMode="hide") */
    isHidden: boolean;
    /** Positioning styles from floating-ui */
    style?: any;
    /** Z-index for the tooltip */
    zIndex?: number;
    /** Reference to the root element */
    ref?: CommonRef;
}

/**
 * Tooltip popup rendering component.
 * Pure JSX template for the tooltip popup element (arrow + inner text + BEM classes).
 *
 * @param props Component props.
 * @return JSX element.
 */
export const TooltipPopup = (props: TooltipPopupProps) => {
    const { id, label, position, isHidden, style, zIndex = TOOLTIP_ZINDEX, className, ref, ...forwardedProps } = props;

    const labelLines = label ? label.split('\n') : [];

    return (
        <div
            ref={ref}
            {...forwardedProps}
            id={id}
            role="tooltip"
            className={classNames.join(
                className,
                block({
                    [`position-${position}`]: Boolean(position),
                }),
                isHidden && classNames.visuallyHidden(),
            )}
            style={{ ...(isHidden ? undefined : style), zIndex }}
            data-popper-placement={position}
        >
            <div className={element('arrow')} />
            <div className={element('inner')}>
                {labelLines.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

TooltipPopup.displayName = COMPONENT_NAME;
TooltipPopup.className = CLASSNAME;

export { ARIA_LINK_MODES, ARROW_SIZE, TOOLTIP_ZINDEX } from './constants';
