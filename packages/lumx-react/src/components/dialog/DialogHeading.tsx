import { Heading, HeadingProps } from '@lumx/react/components/heading';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { Typography } from '@lumx/core/js/constants';
import { DIALOG_LABEL_KEY, DIALOG_HEADING_COMPONENT_NAME } from '@lumx/core/js/components/Dialog/constants';

import { useRegisterId } from '@lumx/react/utils/IdsRegistryContext';

export type DialogHeadingProps = HeadingProps;

/**
 * Names the enclosing dialog-like container (`Dialog`, `Lightbox`, `PopoverDialog`, ...).
 *
 * Thin wrapper over `Heading` that generates its own id (or uses the consumer-supplied `id`),
 * and registers it with the nearest ids registry on mount so the container can link itself to
 * this heading via `aria-labelledby`. Deregisters on unmount.
 *
 * Defaults its typography to `Typography.title` (overridable via the `typography` prop).
 *
 * If two `DialogHeading`s are rendered within the same container, the last one registered wins.
 *
 * @example
 * <Dialog isOpen={isOpen}>
 *     <header>
 *         <Toolbar label={<DialogHeading>My dialog</DialogHeading>} />
 *     </header>
 *     ...
 * </Dialog>
 */
export const DialogHeading = forwardRef<DialogHeadingProps, HTMLElement>((props, ref) => {
    const { id, typography = Typography.title, ...forwardedProps } = props;
    const generatedId = useId();
    const headingId = id || generatedId;

    useRegisterId(DIALOG_LABEL_KEY, headingId);

    return <Heading ref={ref} id={headingId} typography={typography} {...forwardedProps} />;
});

DialogHeading.displayName = DIALOG_HEADING_COMPONENT_NAME;
