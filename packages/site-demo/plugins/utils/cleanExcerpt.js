/** Clean up a page excerpt */
const cleanExcerpt = (excerpt, title) =>
    (excerpt || '')
        // Remove title at the beginning
        .replace(new RegExp(`^ *${title} ?`, 'i'), '')
        // Remove new lines
        .replace(/\n/g, ' ')
        // Remove duplicate spaces
        .replace(/\s+/g, ' ')
        // Remove necessary spaces before punctuations
        .replace(/ +(,|\.)/g, '$1')
        // Naive HTML escape
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();

module.exports = cleanExcerpt;
