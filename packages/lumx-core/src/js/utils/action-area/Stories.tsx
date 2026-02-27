import { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiHeart } from '@lumx/icons';
import { classNames } from '..';

export function setup({
    components: { FlexBox, Heading, Link, Text, Button, IconButton },
    decorators: { withCombinations, withThemedBackground },
}: SetupStoriesOptions<{
    components: { FlexBox: any; Heading: any; Link: any; Text: any; Button: any; IconButton: any };
    decorators: 'withCombinations' | 'withThemedBackground';
}>) {
    const meta = {};

    /** Default action as a button. */
    const CardExample = {
        render: ({
            'data-lumx-hover': hover,
            'data-lumx-active': active,
            'data-focus-visible-added': focused,
            focusStyle,
            theme,
            hasOverlay,
        }: any) => (
            <FlexBox
                as="article"
                orientation="vertical"
                gap="regular"
                className={classNames.join(classNames.actionArea(), classNames.padding('regular'))}
                style={{ width: 250, textAlign: 'left', border: '1px dashed red' }}
            >
                <Heading as="h2">
                    <Link
                        className={classNames.actionArea.action({
                            'has-overlay': hasOverlay,
                            'focus-outset': focusStyle === 'outset',
                            'focus-inset': focusStyle === 'inset',
                            'theme-dark': theme === 'dark',
                            'theme-light': theme !== 'dark',
                        })}
                        href="https://example.com"
                        color={theme === 'dark' ? 'light' : 'dark'}
                        data-lumx-hover={hover || undefined}
                        data-lumx-active={active || undefined}
                        data-focus-visible-added={focused || undefined}
                    >
                        Card title
                    </Link>
                </Heading>
                <Text as="p" style={theme === 'dark' ? { color: 'white' } : undefined}>
                    Description text
                </Text>
                <FlexBox orientation="horizontal" vAlign="right" gap="regular">
                    <IconButton icon={mdiHeart} label="like" size="s" emphasis="medium" theme={theme} />
                    <Button size="s" emphasis="medium" theme={theme}>
                        Secondary action
                    </Button>
                </FlexBox>
            </FlexBox>
        ),
        argTypes: {
            onClick: { action: true },
            hasOverlay: { control: 'boolean' },
            focusStyle: { control: { type: 'inline-radio' }, options: [undefined, 'outset', 'inset'] },
        },
    };

    /** Overlay in all states: theme x focus style x state. */
    const OverlayStates = {
        render: CardExample.render,
        args: {
            hasOverlay: true,
        },
        decorators: [
            withThemedBackground(),
            withCombinations({
                combinations: {
                    rows: {
                        'Light theme': { theme: 'light' },
                        'Dark theme': { theme: 'dark' },
                    },
                    cols: {
                        Default: {},
                        Hover: { 'data-lumx-hover': true },
                        Active: { 'data-lumx-active': true },
                        'Focused (inset)': { 'data-focus-visible-added': true, focusStyle: 'inset' },
                        'Focused (outset)': { 'data-focus-visible-added': true, focusStyle: 'outset' },
                    },
                },
            }),
        ],
    };

    return { meta, CardExample, OverlayStates };
}
