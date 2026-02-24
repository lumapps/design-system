/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref, type PropType, type Ref } from 'vue';
import { Button } from '@lumx/vue';
import { Portal, PortalProvider } from '@lumx/vue/utils';
import { ClickAwayProvider } from './ClickAwayProvider';
import { setup } from '@lumx/core/js/utils/ClickAway/TestStories';

const Card = defineComponent(
    (props: { close: () => void }, { slots }) => {
        const cardRef = ref<HTMLElement>();
        const childrenRefs = ref([cardRef]) as Ref<Array<Ref<HTMLElement | undefined>>>;

        return () => (
            <ClickAwayProvider callback={props.close} childrenRefs={childrenRefs}>
                <Portal>
                    <div class="lumx-spacing-padding" ref={cardRef} style={{ border: '1px solid red' }}>
                        {slots.default?.()}
                    </div>
                </Portal>
            </ClickAwayProvider>
        );
    },
    {
        name: 'Card',
        props: { close: { type: Function as PropType<() => void>, required: true } },
    },
);

const ButtonWithCard = defineComponent(
    (props: { level: number }) => {
        const isOpen = ref(false);
        const open = () => (isOpen.value = true);
        const close = () => (isOpen.value = false);
        const nextLevel = props.level + 1;

        return () => (
            <>
                Level {props.level} - <Button onClick={open}>Open level {nextLevel}</Button>
                {isOpen.value && (
                    <Card close={close}>
                        {nextLevel === 4 ? `Level ${nextLevel}` : <ButtonWithCard level={nextLevel} />}
                    </Card>
                )}
            </>
        );
    },
    {
        name: 'ButtonWithCard',
        props: { level: { type: Number, required: true } },
    },
);

const { meta, ...stories } = setup({
    component: ClickAwayProvider,
    components: { PortalProvider, ButtonWithCard },
});

export default {
    title: 'utils/clickaway/ClickAwayProvider',
    ...meta,
};

export const NestedClickAway = { ...stories.NestedClickAway };
export const InShadowDOM = { ...stories.InShadowDOM };
export const TestClickAwayCloses = { ...stories.TestClickAwayCloses };
export const TestNestedClickAway = { ...stories.TestNestedClickAway };
