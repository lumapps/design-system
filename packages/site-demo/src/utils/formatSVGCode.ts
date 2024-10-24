import difference from 'lodash/difference';

const WHITE_LIST_SVG_ATTRS = ['viewBox'];

/** Keep only the allowed attributes and output as string code */
export function formatSVGCode(svgElement: SVGElement) {
    const output = svgElement.cloneNode(true) as HTMLElement;
    const allAttributes = output.getAttributeNames();
    const attributesToDelete = difference(allAttributes, WHITE_LIST_SVG_ATTRS);
    for (const attribute of attributesToDelete) {
        output.removeAttribute(attribute);
    }
    return output.outerHTML;
}
