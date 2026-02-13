import { render, screen } from '@testing-library/vue';
import { CLASSNAME } from '@lumx/core/js/components/Table/TableRow';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';

import { TableRow, TableCell } from '.';

describe('<TableRow />', () => {
    const setup = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        render(
            {
                template: '<table><tbody><TableRow v-bind="props" /></tbody></table>',
                components: { TableRow },
                setup() {
                    return { props };
                },
            },
            options,
        );
        const tr = getByClassName(document.body, CLASSNAME);
        return { props, tr };
    };

    it('should render default', () => {
        const content = 'Content';
        render({
            template: '<table><tbody><TableRow><TableCell>{{ content }}</TableCell></TableRow></tbody></table>',
            components: { TableRow, TableCell },
            setup() {
                return { content };
            },
        });
        const tableRow = screen.queryByRole('row', { name: content });
        expect(tableRow).toHaveAttribute('tabindex', '-1');
        expect(tableRow).not.toHaveAttribute('aria-disabled');
    });

    // Common tests suite
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tr',
        forwardAttributes: 'tr',
        forwardRef: 'tr',
    });
});
