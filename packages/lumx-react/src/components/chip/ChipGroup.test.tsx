import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import BaseChipGroupTests from '@lumx/core/js/components/Chip/ChipGroupTests';
import { ChipGroup, ChipGroupProps } from './ChipGroup';
import { Chip } from './Chip';

const CLASSNAME = ChipGroup.className as string;

const setup = (propOverrides: Partial<ChipGroupProps> = {}) => {
    const props: ChipGroupProps = {
        children: [<Chip key="1">Chip 1</Chip>, <Chip key="2">Chip 2</Chip>, <Chip key="3">Chip 3</Chip>],
        ...propOverrides,
    };
    render(<ChipGroup {...props} />);
    const chipGroup = getByClassName(document.body, CLASSNAME);

    return { props, chipGroup };
};

describe(`<${ChipGroup.displayName}>`, () => {
    // Run core tests
    BaseChipGroupTests({
        render: (props: ChipGroupProps) => render(<ChipGroup {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render all Chip component children', () => {
            setup();
            expect(screen.getByText('Chip 1')).toBeInTheDocument();
            expect(screen.getByText('Chip 2')).toBeInTheDocument();
            expect(screen.getByText('Chip 3')).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'chipGroup',
        forwardAttributes: 'chipGroup',
    });
});
