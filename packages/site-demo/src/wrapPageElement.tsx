import { Layout } from '@lumx/demo/components/layout/Layout';
import './style/index.scss';

/**
 * Wrap the page element into a layout.
 * This is useful for setting wrapper components around pages that won’t get unmounted on page changes.
 *
 * @return wrapped element.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapPageElement = ({ element, props }: any) => <Layout {...props}>{element}</Layout>;
