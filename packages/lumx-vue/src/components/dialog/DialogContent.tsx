import { defineComponent } from 'vue';

import {
    DialogContent as UI,
    type DialogContentProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Dialog/DialogContent';
import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';

import { useRegisteredId } from '../../utils/IdsRegistryContext';
import { getName, keysOf } from '../../utils/VueToJSX';

export type DialogContentProps = Omit<UIProps, 'labelId'>;

/**
 * Renders the core `DialogContent`, resolving its `aria-labelledby` from the ids registry.
 */
export default defineComponent(
    (props: DialogContentProps) => {
        const labelId = useRegisteredId(DIALOG_LABEL_KEY);
        return () => UI({ ...props, labelId: labelId.value });
    },
    {
        name: getName(COMPONENT_NAME),
        props: keysOf<DialogContentProps>()(
            'ClickAwayProvider',
            'ProgressCircular',
            'clickAwayRefs',
            'content',
            'contentRef',
            'dialogProps',
            'footer',
            'footerChildContent',
            'footerChildProps',
            'forceFooterDivider',
            'forceHeaderDivider',
            'handleClose',
            'hasBottomIntersection',
            'hasTopIntersection',
            'header',
            'headerChildContent',
            'headerChildProps',
            'isLoading',
            'isOpen',
            'rootRef',
            'setSentinelBottom',
            'setSentinelTop',
            'shouldPreventCloseOnClickAway',
            'wrapperRef',
        ),
    },
);
