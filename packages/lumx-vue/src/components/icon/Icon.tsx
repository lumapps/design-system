import { defineComponent } from 'vue-demi';
import { IconProps, Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
    name: 'Icon',
    components: {
        UI,
    },
    setup(props: IconProps) {
        return { props };
    },
    render() {
        return <UI {...this.props} />;
    },
});
