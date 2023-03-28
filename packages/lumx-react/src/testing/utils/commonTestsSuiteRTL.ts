import isEmpty from 'lodash/isEmpty';

import { GenericProps } from '@lumx/react/utils/type';
import { queryByClassName } from '@lumx/react/testing/utils/queries';

interface CommonSetup {
    props: GenericProps;
}

interface Options<S extends CommonSetup> {
    baseClassName: string;
    forwardClassName?: keyof S;
    forwardAttributes?: keyof S;
}

type SetupFunction<S extends CommonSetup> = (props?: GenericProps) => S;

/**
 * Common tests on components
 * - Check base class name and class name forwarding
 * - Check props forwarding
 */
export function commonTestsSuiteRTL<S extends CommonSetup>(setup: SetupFunction<S>, options: Options<S>): void {
    if (isEmpty(options)) {
        return;
    }
    const { baseClassName, forwardClassName, forwardAttributes } = options;
    describe('Common tests suite', () => {
        it('should render with base class name', () => {
            setup();
            expect(queryByClassName(document.body, baseClassName)).toBeInTheDocument();
        });

        if (forwardClassName) {
            it('should forward any CSS class', () => {
                const modifiedProps = {
                    className: 'component component--is-tested',
                };
                const wrappers = setup(modifiedProps);
                expect(wrappers[forwardClassName]).toHaveClass(modifiedProps.className);
            });
        }

        if (forwardAttributes) {
            it('should forward any other prop', () => {
                const modifiedProps = {
                    winter: 'is coming',
                };
                const wrappers = setup(modifiedProps);
                expect(wrappers[forwardAttributes]).toHaveAttribute('winter', modifiedProps.winter);
            });
        }
    });
}
