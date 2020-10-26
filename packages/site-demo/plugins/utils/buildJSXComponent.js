/**
 * Build JSX string with component name and props
 */
module.exports = (componentName, { children, ...props }) => {
    const propStrings = Object.entries(props).map(([name, value]) => `${name}={${value}}`);
    return `<${[componentName, ...propStrings].join(' ')}${children ? `>${children}</${componentName}>` : ' />'}`;
};
