export const assign = (target: any, ...sources: any[]) => {
    sources.forEach((source) => Object.keys(source).forEach((key) => (target[key] = source[key])));
    return target;
};
