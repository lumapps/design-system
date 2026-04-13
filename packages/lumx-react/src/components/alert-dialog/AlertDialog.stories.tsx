/* eslint-disable react-hooks/rules-of-hooks */
import { RefObject, useRef } from 'react';
import { Button, Link } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/AlertDialog/Stories';
import { withChromaticForceScreenSize } from '../../stories/decorators/withChromaticForceScreenSize';
import { AlertDialog } from './AlertDialog';

const { meta, ...stories } = setup({
    component: AlertDialog,
    components: { Link },
    decorators: { withChromaticForceScreenSize, withNestedProps },
    render(props: any) {
        const buttonRef = useRef() as RefObject<HTMLButtonElement>;
        const [isOpen, close, open] = useBooleanState(true);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open dialog
                </Button>
                <AlertDialog {...props} isOpen={isOpen} onClose={close} parentElement={buttonRef} />
            </>
        );
    },
});

export default {
    title: 'LumX components/alert-dialog/AlertDialog',
    ...meta,
};

export const DefaultKind = { ...stories.DefaultKind };
export const Warning = { ...stories.Warning };
export const Success = { ...stories.Success };
export const Error = { ...stories.Error };
export const WithCancel = { ...stories.WithCancel };
export const RichDescription = { ...stories.RichDescription };
