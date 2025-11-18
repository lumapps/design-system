import { buildQueries } from '@testing-library/dom';

export const queryAllByClassName = (container: HTMLElement, className: string) =>
    Array.from(container.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>);

export const [queryByClassName, getAllByClassName, getByClassName, findAllByClassName, findByClassName] = buildQueries(
    queryAllByClassName,
    (_, className) => `Multiple \`.${className}\` found`,
    (_, className) => `No \`.${className}\` found`,
);

export const queryAllByTagName = (container: HTMLElement, tagName: string) =>
    Array.from(container.getElementsByTagName(tagName) as HTMLCollectionOf<HTMLElement>);

export const [queryByTagName, getAllByTagName, getByTagName, findAllByTagName, findByTagName] = buildQueries(
    queryAllByTagName,
    (_, tagName) => `Multiple \`${tagName}\` found`,
    (_, tagName) => `No \`${tagName}\` found`,
);
