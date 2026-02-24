/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from 'react';

import { Button, Text } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';
import { setup } from '@lumx/core/js/components/Popover/Stories';

import { Popover } from '.';

const { meta, ...stories } = setup({
    component: Popover,
    decorators: { withCombinations, withChromaticForceScreenSize },
    render({ anchorText, anchorClassName, popoverClassName, textColor, fitAnchorWidth, ...props }: any) {
        const anchorRef = useRef(null);
        return (
            <>
                <Button ref={anchorRef} size="s" emphasis="medium" className={anchorClassName}>
                    {anchorText}
                </Button>
                <Popover
                    anchorRef={anchorRef}
                    className={popoverClassName}
                    fitToAnchorWidth={fitAnchorWidth}
                    {...props}
                >
                    {fitAnchorWidth != null ? (
                        <>Popover {fitAnchorWidth}</>
                    ) : (
                        <Text as="p" color={textColor} className="lumx-spacing-padding-big">
                            Popover
                        </Text>
                    )}
                </Popover>
            </>
        );
    },
});

export default {
    title: 'LumX components/popover/Popover',
    ...meta,
};

export const Simple = { ...stories.Simple };
export const DarkTheme = { ...stories.DarkTheme };
export const WithoutPortal = { ...stories.WithoutPortal };
export const Placements = { ...stories.Placements };
export const FitToAnchorWidth = { ...stories.FitToAnchorWidth };
