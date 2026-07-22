import { computed, defineComponent, useAttrs } from 'vue';

import { useId } from '../../composables/useId';
import { Typography } from '@lumx/core/js/constants';
import { DIALOG_LABEL_KEY, DIALOG_HEADING_COMPONENT_NAME } from '@lumx/core/js/components/Dialog/constants';

import { useRegisterId } from '../../utils/IdsRegistryContext';
import { getName, keysOf } from '../../utils/VueToJSX';
import Heading, { type HeadingProps } from '../heading/Heading';

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
 *     {{
 *         header: () => (
 *             <Toolbar>
 *                 {{ default: () => <DialogHeading>My dialog</DialogHeading> }}
 *             </Toolbar>
 *         ),
 *     }}
 * </Dialog>
 */
const DialogHeading = defineComponent(
    (props: DialogHeadingProps, { slots }) => {
        const attrs = useAttrs();
        const generatedId = useId();
        const headingId = computed(() => props.id || generatedId);

        useRegisterId(DIALOG_LABEL_KEY, () => headingId.value);

        const headingProps = computed(
            () =>
                ({
                    ...attrs,
                    ...props,
                    id: headingId.value,
                    typography: props.typography ?? Typography.title,
                }) as HeadingProps & Record<string, unknown>,
        );

        return () => <Heading {...headingProps.value}>{slots.default?.()}</Heading>;
    },
    {
        name: getName(DIALOG_HEADING_COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<DialogHeadingProps>()(
            'id',
            'as',
            'color',
            'colorVariant',
            'typography',
            'truncate',
            'noWrap',
            'whiteSpace',
            'style',
            'class',
        ),
    },
);

export default DialogHeading;
