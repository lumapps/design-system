
import { CSS_PREFIX, COMPONENT_PREFIX } from '@lumx/react/constants';

import kebabCase from 'lodash/kebabCase';
import trimStart from 'lodash/trimStart';

/**
 * Get the name of the root CSS class of a component based on its name.
 *
 * @param componentName The name of the component. This name should contains the component prefix and be
 *                               written in PascalCase.
 * @param subComponent Whether the current component is a sub component, if true, define the class according
 *                               to BEM standards.
 * @return The name of the root CSS class. This classname include the CSS classname prefix and is written in
 *                  lower-snake-case.
 */
function getRootClassName(componentName: string, subComponent?: boolean): string {
    const formattedClassName = `${CSS_PREFIX}-${kebabCase(trimStart(componentName, COMPONENT_PREFIX))}`;

    if (subComponent) {
        // See https://regex101.com/r/YjS1uI/3
        const lastPieceOfClassNameRegExp: RegExp = /^(.*)-(.+)$/gi;

        return formattedClassName.replace(lastPieceOfClassNameRegExp, '$1__$2');
    }

    return formattedClassName;
}

export { getRootClassName };
