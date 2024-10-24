import React from 'react';

import { Button, FlexBox, GenericBlock, Icon } from '@lumx/react';
import { formatSVGCode } from '@lumx/demo/utils/formatSVGCode';
import upperFirst from 'lodash/upperFirst';

const formatMdiName = (name: string) => `mdi${name.split('-').map(upperFirst).join('')}`;

/**
 * Display icon with name and quick copy to clipboard buttons
 */
export function IconBlock(props: { name: string; path: string }) {
    const { name, path } = props;
    const ref = React.useRef<HTMLElement>(null);

    const onCopySVG = React.useCallback(() => {
        const originalSVG = ref.current?.querySelector('svg');
        if (!originalSVG) {
            return;
        }
        // Copy SVG code
        navigator.clipboard.writeText(formatSVGCode(originalSVG));
    }, []);

    const onCopyMdiName = React.useCallback(() => {
        // Copy icon name as mdiXXX format
        navigator.clipboard.writeText(formatMdiName(name));
    }, [name]);

    return (
        <GenericBlock className="icon-library-icon" key={name} vAlign="center" orientation="vertical">
            <GenericBlock.Figure>
                <FlexBox className="icon-library-icon__actions" orientation="vertical" gap="regular">
                    <Button emphasis="medium" onClick={onCopyMdiName}>
                        Copy mdi name
                    </Button>
                    <Button emphasis="medium" onClick={onCopySVG}>
                        Copy as SVG
                    </Button>
                </FlexBox>

                <Icon ref={ref} className="icon-library-icon__icon" icon={path} size="l" />
            </GenericBlock.Figure>

            <GenericBlock.Content>{name}</GenericBlock.Content>
        </GenericBlock>
    );
}
