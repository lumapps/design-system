import React from 'react';

import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { ChipGroup, ChipGroupProps } from './ChipGroup';
import { Chip } from './Chip';

const CLASSNAME = ChipGroup.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<ChipGroupProps> = {}) => {
    const props = {
        children: [<Chip key="1">Chip 1</Chip>, <Chip key="2">Chip 2</Chip>, <Chip key="3">Chip 3</Chip>],
        ...propOverrides,
    };
    render(<ChipGroup {...props} />);
    const chipGroup = getByClassName(document.body, CLASSNAME);

    return { props, chipGroup };
};

describe('<ChipGroup />', () => {
    describe('Props', () => {
        it('should render default', () => {
            const { chipGroup } = setup();
            expect(chipGroup).toBeInTheDocument();
            expect(chipGroup).toHaveClass(CLASSNAME);
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'chipGroup',
        forwardAttributes: 'chipGroup',
    });
});
