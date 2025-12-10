import React, { ElementType } from 'react';
import { classNames } from '@lumx/core/js/utils';
import isChromatic from 'chromatic/isChromatic';
import { toggleMaterialTheme } from './toggleMaterialTheme';
import { ThemeProvider } from '@lumx/react';

import '@lumx/core/scss/lumx.scss';
import './index.scss';

import 'focus-visible';

interface StoryBlockProps {
    Story: ElementType;
    context: any;
}

const CLASSNAME = 'story-block';

export const StoryBlock: React.FC<StoryBlockProps> = (props) => {
    const { Story, context } = props;
    const { theme, materialTheme } = context.globals;
    const appliedTheme = context.args.theme || theme;

    // Hard code today date for stable chromatic stories snapshots.
    context.parameters.today = isChromatic() ? new Date('May 25 2021 01:00') : new Date();

    if (isChromatic()) return <Story />;

    React.useEffect(() => {
        toggleMaterialTheme(materialTheme !== 'true')
    }, [materialTheme])

    return (
        <div className={classNames.join(CLASSNAME, context.parameters.hasGreyBackground && `${CLASSNAME}--has-grey-background`, `${CLASSNAME}--theme-${appliedTheme}`)}>
            <ThemeProvider value={appliedTheme || undefined}>
                <Story />
            </ThemeProvider>
        </div>
    );
};
