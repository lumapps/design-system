import { FlexBoxProps as CoreFlexBoxProps } from '@lumx/core/js/components/FlexBox';

export interface FlexBoxProps extends Omit<CoreFlexBoxProps, 'children'> {
    /** Customize the root element. */
    as?: string;
}
