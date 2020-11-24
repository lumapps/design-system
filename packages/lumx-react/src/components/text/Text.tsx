import React from 'react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { EllipsisType, GenericProps, truncate } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TextProps extends GenericProps {
    /** The text to display */
    text: string;
    /** The max number of characteres to display */
    maxChars?: number;
    /** Works with maxChars. The ellipsis method to use */
    ellipsisType?: EllipsisType;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Text`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TextProps> = {
    maxChars: -1,
    ellipsisType: EllipsisType.END,
};

const Text: React.FC<TextProps> = ({ text, ellipsisType, maxChars, ...forwardedProps }) => {
    // const shouldTruncate = ellipsisType && maxChars && maxChars > 0 && text.length > maxChars;
    const a11yProps: any = {};
    const resultingText = truncate(text, { max: maxChars as number, ellipsisType });

    if (resultingText !== text) {
        a11yProps.ariaLabel = text;
    }

    return (
        <span {...a11yProps} {...forwardedProps}>
            {resultingText}
        </span>
    );
};
Text.displayName = COMPONENT_NAME;
Text.defaultProps = DEFAULT_PROPS;

export { Text, TextProps, EllipsisType };
