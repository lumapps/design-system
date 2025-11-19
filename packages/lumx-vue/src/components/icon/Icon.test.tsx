import { render } from '@testing-library/vue';
import Tests from '@lumx/core/js/components/Icon/Tests';
import { Icon, IconProps } from '.';

describe(`<${Icon.displayName}>`, () => {
    Tests((props: IconProps) => {
        render(Icon, { props });
    });
});
