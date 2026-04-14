/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { Button, ImageBlock, Lightbox } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Lightbox/Stories';

/**
 * Story render component for Lightbox.
 *
 * Defined as a standalone component so that:
 * - The button ref is created inside a proper Vue setup context.
 * - Storybook can pass args as reactive props (avoiding stale closure captures).
 * - Children (image content) passed by core story renders flow through attrs as the default slot.
 */
const LightboxStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const buttonRef = ref<HTMLElement>();
        const isOpen = ref(false);

        return () => {
            const { children, ...props } = attrs;
            return (
                <>
                    <Button
                        ref={buttonRef}
                        onClick={() => {
                            isOpen.value = true;
                        }}
                    >
                        Open lightbox
                    </Button>
                    <Lightbox
                        {...props}
                        isOpen={isOpen.value}
                        onClose={() => {
                            isOpen.value = false;
                        }}
                        parentElement={(buttonRef.value as any)?.$el}
                    >
                        {children}
                    </Lightbox>
                </>
            );
        };
    },
    { name: 'LumxLightboxStory', inheritAttrs: false },
);

const { meta, ...stories } = setup({
    component: Lightbox,
    components: { ImageBlock },
    render: (args: any) => () => <LightboxStory {...args} />,
});

export default {
    title: 'LumX components/lightbox/Lightbox',
    ...meta,
};

export const Image = { ...stories.Image };
export const WithCloseButton = { ...stories.WithCloseButton };
// ImageSlideshow is React-only (uses Slideshow/SlideshowItem which are not available in @lumx/vue)
