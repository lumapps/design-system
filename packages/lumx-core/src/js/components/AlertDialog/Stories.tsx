import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { Kind, Size } from '../../constants';
import { DEFAULT_PROPS } from '.';

const dialogSizes = [Size.tiny, Size.regular, Size.big, Size.huge];

/**
 * Setup AlertDialog stories for a specific framework (React or Vue).
 * Framework-specific components and render function are injected via `components` and `render`.
 */
export function setup({
    component: AlertDialog,
    render,
    components: { Link },
    decorators: { withChromaticForceScreenSize, withNestedProps },
}: SetupStoriesOptions<{
    components: { Link: any };
    decorators: 'withChromaticForceScreenSize' | 'withNestedProps';
}>) {
    const meta = {
        component: AlertDialog,
        render,
        args: {
            ...DEFAULT_PROPS,
            'confirmProps.label': 'Ok',
        },
        argTypes: {
            size: getSelectArgType(dialogSizes),
            kind: getSelectArgType(Kind),
            'confirmProps.onClick': { action: true },
        },
        parameters: {
            chromatic: {
                pauseAnimationAtEnd: true,
                delay: DIALOG_TRANSITION_DURATION,
            },
        },
        decorators: [withChromaticForceScreenSize(), withNestedProps()],
    };

    /** Alert dialog with default kind */
    const DefaultKind = {
        args: {
            title: 'Default (info)',
            children: loremIpsum('tiny'),
        },
    };

    /** Alert dialog as warning */
    const Warning = {
        args: {
            ...DefaultKind.args,
            kind: Kind.warning,
            title: 'Warning',
        },
    };

    /** Alert dialog as success */
    const Success = {
        args: {
            ...DefaultKind.args,
            kind: Kind.success,
            title: 'Success',
        },
    };

    /** Alert dialog as error */
    const Error = {
        args: {
            ...DefaultKind.args,
            kind: Kind.error,
            title: 'Error',
        },
    };

    /** Alert dialog with cancel button */
    const WithCancel = {
        argTypes: {
            'cancelProps.onClick': { action: true },
        },
        args: {
            ...DefaultKind.args,
            title: 'With Cancel',
            'cancelProps.label': 'Cancel',
        },
    };

    /** Alert dialog with rich description */
    const RichDescription = {
        argTypes: { children: { control: false } },
        args: {
            ...DefaultKind.args,
            title: 'With Rich Description',
        },
        render: ({ children, ...args }: any) =>
            render({
                ...args,
                children: (
                    <>
                        Amet ut elit dolore irure mollit <strong>sunt culpa esse</strong>.<br />
                        Ea ut Lorem.
                        <br />
                        <Link href="https://example.com" target="_blank">
                            Link
                        </Link>
                    </>
                ),
            }),
    };

    return { meta, DefaultKind, Warning, Success, Error, WithCancel, RichDescription };
}
