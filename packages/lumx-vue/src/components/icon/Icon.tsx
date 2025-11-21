import { defineComponent } from 'vue-demi';
import { IconProps, Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
    name: 'Icon',
    components: {
        UI,
    },
    props: {
        color: {
            type: String,
            required: false,
        },
        colorVariant: {
            type: String,
            required: false,
        },
        hasShape: {
            type: Boolean,
            required: false,
        },
        icon: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: false,
        },
        alt: {
            type: String,
            required: false,
        },
        theme: {
            type: String,
            required: false,
        },
        className: {
            type: String,
            required: false,
        },
        // GenericProps may include other props, but these are the main ones from IconProps
    },
    setup(props: IconProps) {
        return { props };
    },
    render() {
        return <UI {...this.props} />;
    },
});
