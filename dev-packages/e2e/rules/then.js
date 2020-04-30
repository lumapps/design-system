const { Then } = require('cucumber');
const expect = require('expect');

const checkIfElementIsPresent = async (page, selector) => {
    await page.waitForSelector(selector);

    const total = await page.evaluate(async (s) => {
        const totalElements = document.querySelectorAll(s).length;

        return totalElements;
    }, selector);

    expect(total).toBe(1);
};

Then('{int} {string} are present', async function amountPresent(amount, selector) {
    await this.page.waitForSelector(selector);

    const total = await this.page.evaluate(async (s) => {
        const totalElements = document.querySelectorAll(s).length;

        return totalElements;
    }, selector);

    expect(total).toBe(amount);
});

Then('the element {string} is present', async function elementPresent(selector) {
    await checkIfElementIsPresent(this.page, selector);
});

Then('the element {string} is displayed in a modal', async function elementPresent(selector) {
    await this.page.waitForSelector(selector);

    const total = await this.page.evaluate(async (s) => {
        const totalElements = document.querySelectorAll(`.lumx-dialog ${s}`).length;

        return totalElements;
    }, selector);

    expect(total).toBe(1);
});

Then('each {string} has a {string}', async function eachContainerHasAnElement(container, selector) {
    const elementSelector = selectors[element];
    await this.page.waitForSelector(selector);

    const total = await this.page.evaluate(async (s) => {
        const totalElements = document.querySelectorAll(s).length;

        return totalElements > 0;
    }, `${selector} ${elementSelector}`);

    expect(total).toBe(true);
});

Then('the user closes the page', async function closePage() {
    await this.closePage();
});
