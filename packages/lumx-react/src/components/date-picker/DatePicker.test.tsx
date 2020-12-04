import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { DatePickerProps } from './base';
import { DatePicker } from './DatePicker';

const mockedDate = new Date(
    new Date(1487721600).toLocaleString('en-US', {
        timeZone: 'America/Toronto',
    }),
);
Date.now = jest.fn(() => mockedDate.valueOf());

type SetupProps = Partial<DatePickerProps>;

interface Setup extends CommonSetup {
    props: SetupProps;
}

const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering = true): Setup => {
    const props: DatePickerProps = {
        locale: 'fr',
        onChange: jest.fn(),
        value: mockedDate,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DatePicker {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${DatePicker.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
