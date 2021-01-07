import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Wrapper } from '@lumx/react/testing/utils';
import { DatePickerProps } from '@lumx/react';
import { DatePicker } from './DatePicker';

const mockedDate = new Date(
    new Date(1487721600).toLocaleString('en-US', {
        timeZone: 'America/Toronto',
    }),
);
Date.now = jest.fn(() => mockedDate.valueOf());

type SetupProps = Partial<DatePickerProps>;

const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: DatePickerProps = {
        locale: 'fr',
        onChange: jest.fn(),
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<DatePicker {...props} />);

    return { props, wrapper };
};

describe(`<${DatePicker.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
