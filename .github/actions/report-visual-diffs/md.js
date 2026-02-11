/** Markdown formatting helpers. */
const md = {
    heading: (level, text) => `${'#'.repeat(level)} ${text}`,
    h2: (text) => md.heading(2, text),
    h3: (text) => md.heading(3, text),
    bold: (text) => `<strong>${text}</strong>`,
    link: (text, url) => `[${text}](${url})`,
    image: (url, { width } = {}) => `<img src="${url}"${width ? ` width="${width}"` : ''} />`,
    linkedImage: (url, { width } = {}) => `<a href="${url}">${md.image(url, { width })}</a>`,
    blockquote: (text) => `> ${text}`,
    warning: (text) => `> [!WARNING]\n> ${text}`,
    rule: '---',
    details: (summary, ...contentLines) => [
        `<details>`,
        `<summary>${summary}</summary>`,
        '',
        ...contentLines,
        '</details>',
    ],
    tableRow: (cells) => '| ' + cells.join(' | ') + ' |',
    table: (headers, row) => [md.tableRow(headers), md.tableRow(headers.map(() => '---')), md.tableRow(row)].join('\n'),
};

module.exports = { md };
