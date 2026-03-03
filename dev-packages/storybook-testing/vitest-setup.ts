import '@lumx/core/stories/vitest-overrides.css';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { vis, visAnnotations } from 'storybook-addon-vis/vitest-setup';
import { beforeAll, expect } from 'vitest';

type SetProjectAnnotationsFn = (annotations: any[]) => { beforeAll: () => Promise<void> };

/** Wait for all images in the document to finish loading (or error). */
function waitForImages(timeout = 3_000): Promise<void> {
    return new Promise((resolve) => {
        const images = document.querySelectorAll('img');
        const pending = Array.from(images).filter((img) => !img.complete);
        if (pending.length === 0) return resolve();

        let settled = false;
        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                resolve();
            }
        }, timeout);

        let remaining = pending.length;
        const onSettled = () => {
            remaining--;
            if (remaining <= 0 && !settled) {
                settled = true;
                clearTimeout(timer);
                resolve();
            }
        };
        for (const img of pending) {
            img.addEventListener('load', onSettled, { once: true });
            img.addEventListener('error', onSettled, { once: true });
        }
    });
}

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
            // Skip image snapshots unless IMAGE_SNAPSHOT env flag is set.
            if (!process.env.IMAGE_SNAPSHOT) return false;

            // Wait for all images to load before taking the screenshot.
            await waitForImages();

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
