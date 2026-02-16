import { render } from '@testing-library/vue';
import { CLASSNAME } from '@lumx/core/js/components/Table/TableBody';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';

import { TableBody } from '.';

describe('<TableBody />', () => {
    const setup = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        render(
            {
                template: '<table><TableBody v-bind="props" /></table>',
                components: { TableBody },
                setup() {
                    return { props };
                },
            },
            options,
        );
        const tbody = getByClassName(document.body, CLASSNAME);
        return { props, tbody };
    };

    // Common tests suite
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tbody',
        forwardAttributes: 'tbody',
        forwardRef: 'tbody',
    });
});
