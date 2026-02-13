import { render } from '@testing-library/vue';
import { CLASSNAME } from '@lumx/core/js/components/Table/TableHeader';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';

import { TableHeader } from '.';

describe('<TableHeader />', () => {
    const setup = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        render(
            {
                template: '<table><TableHeader v-bind="props" /></table>',
                components: { TableHeader },
                setup() {
                    return { props };
                },
            },
            options,
        );
        const thead = getByClassName(document.body, CLASSNAME);
        return { props, thead };
    };

    // Common tests suite
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thead',
        forwardAttributes: 'thead',
        forwardRef: 'thead',
    });
});
