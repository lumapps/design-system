import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';

import { useCoreState, type CoreStateOptions } from './useCoreState';

/** Counter core state: reads the `step` prop on each click. */
const createCounter = ({ getProps, onUpdate }: CoreStateOptions<{ step: number }>) => {
    let count = 0;
    return {
        getView: () => ({ count }),
        increment() {
            count += getProps().step;
            onUpdate();
        },
    };
};

const Counter = defineComponent({
    props: { step: { type: Number, required: true } },
    setup(props) {
        const state = useCoreState(createCounter, () => props);
        return () => h('button', { onClick: state.increment }, String(state.getView().count));
    },
});

describe('useCoreState', () => {
    it('should read the latest props and render on update', async () => {
        const wrapper = mount(Counter, { props: { step: 1 } });
        await wrapper.find('button').trigger('click');
        expect(wrapper.text()).toBe('1');

        await wrapper.setProps({ step: 10 });
        await wrapper.find('button').trigger('click');
        await nextTick();
        expect(wrapper.text()).toBe('11');
    });
});
