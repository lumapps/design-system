import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import { getByClassName } from '@lumx/core/testing/queries';
import BaseChipGroupTests from '@lumx/core/js/components/Chip/ChipGroupTests';
import { CLASSNAME } from '@lumx/core/js/components/Chip/ChipGroup';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ChipGroup, Chip } from '.';

describe('<ChipGroup />', () => {
    const renderChipGroup = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(ChipGroup, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseChipGroupTests({
        render: renderChipGroup,
        screen,
    });

    const setupChipGroup = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const wrapper = renderChipGroup(props, options);
        const chipGroup = getByClassName(document.body, CLASSNAME);
        const div = chipGroup;

        return { props, chipGroup, wrapper, div };
    };

    // Vue-specific tests
    describe('Vue', () => {
        it('should render all Chip component children', () => {
            renderChipGroup({
                children: () => [
                    h(Chip, { key: '1' }, () => 'Chip 1'),
                    h(Chip, { key: '2' }, () => 'Chip 2'),
                    h(Chip, { key: '3' }, () => 'Chip 3'),
                ],
            });

            expect(screen.getByText('Chip 1')).toBeInTheDocument();
            expect(screen.getByText('Chip 2')).toBeInTheDocument();
            expect(screen.getByText('Chip 3')).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupChipGroup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
    });
});
