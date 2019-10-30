import { Placement } from 'LumX/components/popover/react/Popover';

const calculatePopoverPlacement = (
    placement: Placement,
    anchor: ClientRect,
    popover: ClientRect,
): {
    x: number;
    y: number;
} => {
    const splittedPlacement = placement.split('-');
    const verticalPlacement = splittedPlacement[0];
    const horizontalPlacement = splittedPlacement[1];
    const { top, left, width: widthAnchor, height: heightAnchor } = anchor;
    const { width: widthPopover, height: heightPopover }: ClientRect | DOMRect = popover;
    let x = 0;
    let y = 0;
    switch (verticalPlacement) {
        case 'top':
            y += top - heightPopover;

            switch (horizontalPlacement) {
                case 'start':
                    x += left;

                    break;
                case 'end':
                    x += left + widthAnchor - widthPopover;
                    break;

                default:
                    x += left + (widthAnchor - widthPopover) / 2;

                    break;
            }

            break;
        case 'right':
            x += left + widthAnchor;

            switch (horizontalPlacement) {
                case 'start':
                    y += top;

                    break;
                case 'end':
                    y += top + heightAnchor - heightPopover;

                    break;

                default:
                    y += top + (heightAnchor - heightPopover) / 2;

                    break;
            }

            break;
        case 'bottom':
            y += top + heightAnchor;

            switch (horizontalPlacement) {
                case 'start':
                    x += left;

                    break;
                case 'end':
                    x += left + widthAnchor - widthPopover;

                    break;

                default:
                    x += left + (widthAnchor - widthPopover) / 2;

                    break;
            }

            break;
        case 'left':
            x += left - widthPopover;

            switch (horizontalPlacement) {
                case 'start':
                    y += top;

                    break;
                case 'end':
                    y += top + heightAnchor - heightPopover;

                    break;

                default:
                    y += top + (heightAnchor - heightPopover) / 2;

                    break;
            }

            break;

        default:
            break;
    }

    return { x, y };
};

export { calculatePopoverPlacement };
