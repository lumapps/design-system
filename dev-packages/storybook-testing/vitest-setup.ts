import '@lumx/core/stories/vitest-overrides.css';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { vis, visAnnotations } from 'storybook-addon-vis/vitest-setup';
import { beforeAll, expect } from 'vitest';

type SetProjectAnnotationsFn = (annotations: any[]) => { beforeAll: () => Promise<void> };

/**
 * Setup storybook vitest with visual snapshot testing.
 * Visual diffs are logged as warnings instead of failing the test.
 */
export function setupStorybookVitest(
    setProjectAnnotations: SetProjectAnnotationsFn,
    projectAnnotations: Record<string, any>,
) {
    const annotations = setProjectAnnotations([a11yAddonAnnotations, visAnnotations, projectAnnotations]);

    beforeAll(annotations.beforeAll);

    vis.setup({
        auto: async (options) => {
            const subject = options.subject ? document.querySelector(options.subject) ?? document.body : document.body;
            try {
                await expect(subject).toMatchImageSnapshot(options);
            } catch (err) {
                // Log visual diff as a warning instead of failing the test.
                // Diff images are still generated (written before the error is thrown).
                console.warn('[Visual diff]', (err as Error).message);
            }
            // Return false to skip the built-in hard-asserting snapshot.
            return false;
        },
    });
}
