import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { DatePickerField, DatePickerFieldProps } from './DatePickerField';

const mockedDate = new Date(
    new Date(1487721600).toLocaleString('en-US', {
        timeZone: 'America/Toronto',
    }),
);
Date.now = jest.fn(() => mockedDate.valueOf());

type SetupProps = Partial<DatePickerFieldProps>;

interface Setup extends CommonSetup {
    props: SetupProps;
}

const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const props: DatePickerFieldProps = {
        label: 'DatePickerField',
        locale: 'fr',
        onChange: jest.fn(),
        value: mockedDate,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DatePickerField {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${DatePickerField.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly when passed a date object', () => {
            const { wrapper } = setup({ value: new Date('January 18, 1970') });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
